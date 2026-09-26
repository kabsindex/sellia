import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import bcrypt from 'bcryptjs';
import express from 'express';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import session from 'express-session';
import mysqlSession from 'express-mysql-session';
import multer from 'multer';
import sharp from 'sharp';
import { pool, slugify, uniqueSlug } from './db.js';
import { ensureSchema } from './schema.js';
import { createBillingPortal, createPremiumCheckout, handleStripeWebhook } from './stripe-billing.js';
import {
  campaignMessage,
  confirmationMessage,
  createNewsletterTransport,
  newsletterMailReady,
  previewMessage
} from './newsletter-mailer.js';

await ensureSchema();

const app = express();
const MySQLStore = mysqlSession(session);
// Keep account sessions across API restarts while WAMP/MySQL remains available.
const sessionStore = new MySQLStore({
  clearExpired: true,
  expiration: 7 * 24 * 60 * 60 * 1000,
  createDatabaseTable: true,
  schema: {
    tableName: 'sellia_sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, pool);
await sessionStore.onReady();
const uploadDirectory = path.resolve('public', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      callback(new Error('Utilise une image JPG, PNG, WebP ou AVIF.'));
      return;
    }
    callback(null, true);
  }
});
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    await handleStripeWebhook(req.body, req.get('stripe-signature'));
    res.json({ received: true });
  } catch (error) {
    if (error?.type === 'StripeSignatureVerificationError') {
      return fail(res, 400, 'Signature Stripe invalide.');
    }
    console.error('SELLIA webhook Stripe:', error);
    return fail(res, error.status || 500, 'Impossible de traiter cet événement Stripe.');
  }
});
app.use(express.json({ limit: '2mb' }));
app.use(session({
  name: 'sellia.sid',
  secret: process.env.SESSION_SECRET || 'sellia-local-session-secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

const newsletterSignupLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => `${req.params.slug}:${ipKeyGenerator(req.ip, 56)}`,
  skip: (req) => req.params.slug === 'novamarket-premium',
  message: { error: 'Trop de demandes. Réessaie dans une heure.' }
});

const clean = (value, length = 500) => typeof value === 'string' ? value.trim().slice(0, length) : '';
const storeThemeIds = new Set(['emerald', 'midnight', 'sand', 'coral', 'noir', 'royal', 'rose', 'nordic']);
const normalizeStoreName = (value) => clean(value, 120).replace(/\s+/g, ' ');
const imagePath = (value) => {
  const src = clean(value, 500);
  if (!src) return '';
  if (src.startsWith('./')) return `/${src.slice(2)}`;
  return src;
};
const validEmail = (email) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validNewsletterToken = (token) => /^[a-f0-9]{64}$/.test(token);
const isDemoStore = (store) => store.slug === 'novamarket-premium';
const databaseImagePath = (value) => imagePath(value);
const fail = (res, status, error) => res.status(status).json({ error });
const saveSession = (req) => new Promise((resolve, reject) => {
  req.session.save((error) => error ? reject(error) : resolve());
});

async function storeNameExists(name, excludeStoreId = 0, executor = pool) {
  const normalized = normalizeStoreName(name);
  if (!normalized) return false;
  const [[store]] = await executor.query(
    "SELECT id FROM stores WHERE LOWER(TRIM(name)) = LOWER(?) AND id <> ? AND slug <> 'novamarket-premium' LIMIT 1",
    [normalized, excludeStoreId]
  );
  return Boolean(store);
}

async function uniqueStoreName(base, executor = pool) {
  const root = normalizeStoreName(base) || 'Ma boutique';
  for (let suffix = 1; suffix < 1000; suffix += 1) {
    const candidate = suffix === 1 ? root : `${root} ${suffix}`;
    if (!await storeNameExists(candidate, 0, executor)) return candidate;
  }
  throw new Error('Impossible de générer un nom de boutique temporaire.');
}

function isDuplicateStoreNameError(error) {
  return error?.code === 'ER_DUP_ENTRY' &&
    String(error.sqlMessage || error.message).includes('unique_store_name');
}

async function findStore(slug) {
  const [[store]] = await pool.query('SELECT * FROM stores WHERE slug = ?', [slug]);
  return store || null;
}

async function requireStoreOwner(req, res, next) {
  try {
    if (!req.session.userId) return fail(res, 401, 'Connecte-toi pour modifier cette boutique.');
    const store = await findStore(req.params.slug);
    if (!store) return fail(res, 404, 'Boutique introuvable.');
    if (Number(store.owner_id) !== Number(req.session.userId)) {
      return fail(res, 403, 'Tu ne peux pas modifier cette boutique.');
    }
    next();
  } catch (error) {
    next(error);
  }
}

function requireSignedIn(req, res, next) {
  if (!req.session.userId) return fail(res, 401, 'Connecte-toi pour continuer.');
  next();
}

async function loadBootstrap(slug) {
  const store = await findStore(slug);
  if (!store) return null;
  const [categories] = await pool.query('SELECT id, name, slug, emoji FROM categories WHERE store_id = ? ORDER BY sort_order, id', [store.id]);
  const [products] = await pool.query('SELECT * FROM products WHERE store_id = ? ORDER BY featured DESC, id', [store.id]);
  const productIds = products.map((item) => item.id);
  let images = [];
  let sizes = [];
  let colors = [];
  if (productIds.length) {
    [images] = await pool.query('SELECT product_id, src FROM product_images WHERE product_id IN (?) ORDER BY sort_order, id', [productIds]);
    [sizes] = await pool.query('SELECT product_id, label FROM product_sizes WHERE product_id IN (?) ORDER BY sort_order, id', [productIds]);
    [colors] = await pool.query('SELECT product_id, name, hex FROM product_colors WHERE product_id IN (?) ORDER BY sort_order, id', [productIds]);
  }
  const [orders] = await pool.query('SELECT * FROM orders WHERE store_id = ? ORDER BY created_at DESC', [store.id]);
  const [[visitTotals]] = await pool.query(`
    SELECT
      SUM(visited_on >= CURRENT_DATE - INTERVAL 6 DAY) AS visitors_7d,
      COUNT(*) AS visitors_30d
    FROM store_visits
    WHERE store_id = ? AND visited_on >= CURRENT_DATE - INTERVAL 29 DAY
  `, [store.id]);
  const [dailyVisits] = await pool.query(`
    SELECT DATE_FORMAT(visited_on, '%Y-%m-%d') AS date, COUNT(*) AS visitors
    FROM store_visits
    WHERE store_id = ? AND visited_on >= CURRENT_DATE - INTERVAL 29 DAY
    GROUP BY visited_on
    ORDER BY visited_on
  `, [store.id]);
  const orderIds = orders.map((item) => item.id);
  let orderItems = [];
  if (orderIds.length) {
    [orderItems] = await pool.query('SELECT * FROM order_items WHERE order_id IN (?) ORDER BY id', [orderIds]);
  }

  const mappedOrders = orders.map((order) => ({
    id: String(order.id),
    reference: order.reference,
    customerName: order.customer_name,
    phone: order.customer_phone,
    address: order.customer_address || '',
    city: order.city || '',
    note: order.note || '',
    total: Number(order.total),
    status: order.status,
    createdAt: new Date(order.created_at).toISOString(),
    channel: order.channel || 'whatsapp',
    items: orderItems.filter((item) => item.order_id === order.id).map((item) => ({
      productId: String(item.product_id || ''),
      name: item.name,
      image: imagePath(item.image),
      price: Number(item.price),
      quantity: item.quantity,
      size: item.size || undefined,
      color: item.color || undefined
    }))
  }));

  const customerMap = new Map();
  for (const order of mappedOrders) {
    const current = customerMap.get(order.phone) || {
      id: `customer-${customerMap.size + 1}`,
      name: order.customerName,
      phone: order.phone,
      city: order.city,
      ordersCount: 0,
      spent: 0,
      lastOrder: order.createdAt
    };
    current.ordersCount += 1;
    if (order.status !== 'annulee') current.spent += order.total;
    if (new Date(order.createdAt) > new Date(current.lastOrder)) current.lastOrder = order.createdAt;
    customerMap.set(order.phone, current);
  }

  const storedCover = imagePath(store.cover);

  return {
    store: {
      name: store.name,
      slug: store.slug,
      category: store.category,
      description: store.description,
      logo: imagePath(store.logo),
      cover: storedCover === '/cover.jpg' ? '' : storedCover,
      coverMobile: imagePath(store.cover_mobile),
      whatsapp: store.whatsapp,
      address: store.address || '',
      city: store.city || '',
      country: store.country || '',
      currency: store.currency || '$',
      instagram: store.instagram || '',
      tiktok: store.tiktok || '',
      facebook: store.facebook || '',
      theme: store.theme || 'emerald',
      layout: store.layout || 'grid',
      font: store.font || 'Geist',
      heroTitle: store.hero_title || store.name,
      heroSubtitle: store.hero_subtitle || store.description,
      ctaLabel: store.cta_label || 'Commander sur WhatsApp',
      showBranding: Boolean(store.show_branding),
      plan: store.plan,
      newsletterAvailable: store.plan === 'premium' && !isDemoStore(store) && newsletterMailReady(),
      verificationStatus: store.verification_status
    },
    categories: categories.map((item) => ({ id: String(item.id), name: item.name, slug: item.slug, emoji: item.emoji || 'tag' })),
    products: products.map((product) => ({
      id: String(product.id),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      oldPrice: product.old_price === null ? undefined : Number(product.old_price),
      categoryId: String(product.category_id || ''),
      images: images.filter((item) => item.product_id === product.id).map((item) => imagePath(item.src)),
      stock: product.stock,
      sizes: sizes.filter((item) => item.product_id === product.id).map((item) => item.label),
      colors: colors.filter((item) => item.product_id === product.id).map((item) => ({ name: item.name, hex: item.hex })),
      available: Boolean(product.available),
      promo: Boolean(product.promo),
      featured: Boolean(product.featured),
      hidden: Boolean(product.hidden),
      views: product.views || 0,
      createdAt: new Date(product.created_at).toISOString()
    })),
    orders: mappedOrders,
    customers: Array.from(customerMap.values()),
    analytics: {
      visitors7d: Number(visitTotals.visitors_7d || 0),
      visitors30d: Number(visitTotals.visitors_30d || 0),
      daily: dailyVisits.map((item) => ({ date: item.date, visitors: Number(item.visitors) }))
    },
    onboardingComplete: Boolean(store.onboarding_complete)
  };
}

async function saveVariants(connection, productId, product) {
  await connection.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
  await connection.query('DELETE FROM product_sizes WHERE product_id = ?', [productId]);
  await connection.query('DELETE FROM product_colors WHERE product_id = ?', [productId]);
  for (const [index, src] of (product.images || []).entries()) {
    await connection.query('INSERT INTO product_images (product_id, src, sort_order) VALUES (?, ?, ?)', [productId, databaseImagePath(src), index]);
  }
  for (const [index, label] of (product.sizes || []).entries()) {
    await connection.query('INSERT INTO product_sizes (product_id, label, sort_order) VALUES (?, ?, ?)', [productId, clean(label, 50), index]);
  }
  for (const [index, color] of (product.colors || []).entries()) {
    await connection.query('INSERT INTO product_colors (product_id, name, hex, sort_order) VALUES (?, ?, ?, ?)', [productId, clean(color.name, 80), clean(color.hex, 7), index]);
  }
}

app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: process.env.DB_NAME || 'sellia' });
  } catch (error) { next(error); }
});

app.get('/api/bootstrap', async (req, res, next) => {
  try {
    let slug = clean(req.query.slug, 140) || 'novamarket';
    if (req.query.dashboard === '1') {
      if (!req.session.userId) {
        return fail(res, 401, 'Ta session a expiré. Reconnecte-toi pour retrouver ta boutique.');
      }
      let owned = null;
      if (req.session.activeStoreId) {
        [[owned]] = await pool.query(
          'SELECT id, slug FROM stores WHERE owner_id = ? AND id = ? LIMIT 1',
          [req.session.userId, req.session.activeStoreId]
        );
      }
      if (!owned) {
        [[owned]] = await pool.query(
          'SELECT id, slug FROM stores WHERE owner_id = ? ORDER BY id LIMIT 1',
          [req.session.userId]
        );
      }
      if (!owned) return fail(res, 404, 'Aucune boutique n’est associée à ce compte.');
      req.session.activeStoreId = owned.id;
      slug = owned.slug;
    }
    const payload = await loadBootstrap(slug);
    if (!payload) return fail(res, 404, 'Boutique introuvable.');
    let user = null;
    if (req.session.userId) {
      const [[record]] = await pool.query('SELECT name, email FROM users WHERE id = ?', [req.session.userId]);
      if (record) {
        const [firstName, ...lastName] = record.name.split(' ');
        user = { firstName, lastName: lastName.join(' '), email: record.email, whatsapp: payload.store.whatsapp, plan: payload.store.plan };
      }
    }
    res.json({ ...payload, user });
  } catch (error) { next(error); }
});

app.get('/api/stores/name-availability', requireSignedIn, async (req, res, next) => {
  try {
    const name = normalizeStoreName(req.query.name);
    if (name.length < 2) return fail(res, 400, 'Saisis au moins 2 caractères.');

    let currentStoreId = 0;
    if (req.session.activeStoreId) {
      const [[activeStore]] = await pool.query(
        'SELECT id FROM stores WHERE id = ? AND owner_id = ? LIMIT 1',
        [req.session.activeStoreId, req.session.userId]
      );
      currentStoreId = activeStore?.id || 0;
    }

    res.json({ available: !await storeNameExists(name, currentStoreId) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/stores/:slug/visit', async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    if (!store) return fail(res, 404, 'Boutique introuvable.');
    if (req.session.userId && Number(store.owner_id) === Number(req.session.userId)) {
      return res.status(200).json({ ok: true, counted: false });
    }
    const suppliedKey = clean(req.body.visitorKey, 80);
    const fallback = `${req.ip}|${req.get('user-agent') || ''}`;
    const visitorKey = suppliedKey || crypto.createHash('sha256').update(fallback).digest('hex');
    await pool.query(
      'INSERT IGNORE INTO store_visits (store_id, visitor_key, visited_on) VALUES (?, ?, CURRENT_DATE)',
      [store.id, visitorKey]
    );
    res.status(201).json({ ok: true, counted: true });
  } catch (error) { next(error); }
});

app.post('/api/stores/:slug/subscribers', newsletterSignupLimit, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    if (!store) return fail(res, 404, 'Boutique introuvable.');
    if (store.plan !== 'premium') return fail(res, 403, 'Cette boutique ne propose pas encore les abonnements.');
    const email = clean(req.body?.email, 500).toLowerCase();
    if (!validEmail(email)) return fail(res, 400, 'Entre une adresse e-mail valide.');
    if (req.body?.consent !== true) {
      return fail(res, 400, 'Confirme que tu souhaites recevoir les e-mails de cette boutique.');
    }
    if (isDemoStore(store)) return res.json({ demo: true });
    if (!newsletterMailReady()) return fail(res, 503, 'Les inscriptions par e-mail sont temporairement indisponibles.');

    const [[existing]] = await pool.query(
      'SELECT id, confirmed_at, confirmation_sent_at FROM store_subscribers WHERE store_id = ? AND email = ?',
      [store.id, email]
    );
    if (existing?.confirmed_at) return res.json({ pending: true });
    if (existing?.confirmation_sent_at && Date.now() - new Date(existing.confirmation_sent_at).getTime() < 10 * 60 * 1000) {
      return res.json({ pending: true });
    }

    const confirmationToken = crypto.randomBytes(32).toString('hex');
    let subscriberId = existing?.id;
    const created = !existing;
    if (existing) {
      await pool.query(
        'UPDATE store_subscribers SET confirmation_token = ?, confirmation_sent_at = NOW() WHERE id = ? AND store_id = ?',
        [confirmationToken, existing.id, store.id]
      );
    } else {
      const [result] = await pool.query(
        'INSERT IGNORE INTO store_subscribers (store_id, email, unsubscribe_token, confirmation_token, confirmation_sent_at) VALUES (?, ?, ?, ?, NOW())',
        [store.id, email, crypto.randomBytes(32).toString('hex'), confirmationToken]
      );
      if (!result.affectedRows) return res.json({ pending: true });
      subscriberId = result.insertId;
    }

    const transport = createNewsletterTransport();
    try {
      await transport.sendMail(confirmationMessage({ email, storeName: store.name, token: confirmationToken }));
    } catch (error) {
      console.error('SELLIA confirmation e-mail:', error);
      if (created) {
        await pool.query('DELETE FROM store_subscribers WHERE id = ? AND confirmed_at IS NULL', [subscriberId]);
      } else {
        await pool.query(
          'UPDATE store_subscribers SET confirmation_sent_at = NULL WHERE id = ? AND confirmation_token = ?',
          [subscriberId, confirmationToken]
        );
      }
      return fail(res, 502, 'Impossible d’envoyer le message de confirmation. Réessaie plus tard.');
    } finally {
      transport.close();
    }
    res.status(202).json({ pending: true });
  } catch (error) { next(error); }
});

app.post('/api/newsletter/confirm', async (req, res, next) => {
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token.trim() : '';
    if (!validNewsletterToken(token)) return fail(res, 400, 'Lien de confirmation invalide.');
    const [result] = await pool.query(
      'UPDATE store_subscribers SET confirmed_at = NOW(), confirmation_token = NULL WHERE confirmation_token = ? AND confirmed_at IS NULL AND confirmation_sent_at >= NOW() - INTERVAL 48 HOUR',
      [token]
    );
    if (!result.affectedRows) return fail(res, 404, 'Ce lien de confirmation est expiré ou déjà utilisé.');
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.get('/api/stores/:slug/subscribers', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    const [rows] = await pool.query(
      'SELECT id, email, unsubscribe_token, created_at, confirmed_at FROM store_subscribers WHERE store_id = ? ORDER BY created_at DESC, id DESC',
      [store.id]
    );
    res.json(rows.map((row) => ({
      id: String(row.id),
      email: row.email,
      unsubscribeToken: row.unsubscribe_token,
      confirmedAt: row.confirmed_at ? new Date(row.confirmed_at).toISOString() : null,
      createdAt: new Date(row.created_at).toISOString()
    })));
  } catch (error) { next(error); }
});

app.delete('/api/stores/:slug/subscribers/:id', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    const [result] = await pool.query(
      'DELETE FROM store_subscribers WHERE id = ? AND store_id = ?',
      [req.params.id, store.id]
    );
    if (!result.affectedRows) return fail(res, 404, 'Abonné introuvable.');
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.post('/api/newsletter/unsubscribe', async (req, res, next) => {
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token.trim() : '';
    if (!validNewsletterToken(token)) return fail(res, 400, 'Lien de désabonnement invalide.');
    await pool.query('DELETE FROM store_subscribers WHERE unsubscribe_token = ?', [token]);
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.post('/api/newsletter/unsubscribe/:token', async (req, res, next) => {
  try {
    if (!validNewsletterToken(req.params.token)) return fail(res, 400, 'Lien de désabonnement invalide.');
    await pool.query('DELETE FROM store_subscribers WHERE unsubscribe_token = ?', [req.params.token]);
    res.json({ ok: true });
  } catch (error) { next(error); }
});

function newsletterContent(body) {
  return clean(body, 5000);
}

async function dispatchNewsletterCampaign(campaignId, store, recipientIds) {
  let transport;
  let sent = 0;
  let failed = 0;
  let skipped = 0;
  try {
    const [[campaign]] = await pool.query('SELECT subject, body FROM newsletter_campaigns WHERE id = ? AND store_id = ?', [campaignId, store.id]);
    transport = createNewsletterTransport();
    for (const recipientId of recipientIds) {
      const [[current]] = await pool.query(
        'SELECT email, unsubscribe_token FROM store_subscribers WHERE id = ? AND store_id = ? AND confirmed_at IS NOT NULL',
        [recipientId, store.id]
      );
      if (!current) {
        skipped += 1;
      } else {
        try {
          await transport.sendMail(campaignMessage({
            email: current.email,
            storeName: store.name,
            storeSlug: store.slug,
            subject: campaign.subject,
            body: campaign.body,
            unsubscribeToken: current.unsubscribe_token,
            replyTo: validEmail(store.email || '') ? store.email : undefined
          }));
          sent += 1;
        } catch (error) {
          failed += 1;
          console.error('SELLIA campagne e-mail:', error);
        }
      }
      await pool.query(
        'UPDATE newsletter_campaigns SET sent_count = ?, failed_count = ?, skipped_count = ? WHERE id = ?',
        [sent, failed, skipped, campaignId]
      );
    }
    const status = failed === 0 && skipped === 0 ? 'sent' : sent > 0 ? 'partial' : 'failed';
    await pool.query('UPDATE newsletter_campaigns SET status = ?, finished_at = NOW() WHERE id = ?', [status, campaignId]);
  } catch (error) {
    console.error('SELLIA campagne interrompue:', error);
    try {
      await pool.query('UPDATE newsletter_campaigns SET status = ?, finished_at = NOW() WHERE id = ?', ['interrupted', campaignId]);
    } catch (updateError) {
      console.error('SELLIA statut de campagne:', updateError);
    }
  } finally {
    transport?.close();
  }
}

app.get('/api/stores/:slug/newsletter/campaigns', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    const [rows] = await pool.query(
      'SELECT id, subject, status, recipient_count, sent_count, failed_count, skipped_count, created_at FROM newsletter_campaigns WHERE store_id = ? ORDER BY id DESC LIMIT 30',
      [store.id]
    );
    res.json(rows.map((row) => ({
      id: String(row.id),
      subject: row.subject,
      status: row.status,
      recipientCount: row.recipient_count,
      sentCount: row.sent_count,
      failedCount: row.failed_count,
      skippedCount: row.skipped_count,
      createdAt: new Date(row.created_at).toISOString()
    })));
  } catch (error) { next(error); }
});

app.post('/api/stores/:slug/newsletter/test', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    if (store.plan !== 'premium' || isDemoStore(store)) return fail(res, 403, 'Envoi réservé aux boutiques Premium actives.');
    if (!newsletterMailReady()) return fail(res, 503, 'Le service e-mail n’est pas encore configuré.');
    const subject = clean(req.body?.subject, 180).replace(/[\r\n]+/g, ' ');
    const body = newsletterContent(req.body?.body);
    if (subject.length < 3 || body.length < 10) return fail(res, 400, 'Ajoute un objet et un message d’au moins 10 caractères.');
    const [[owner]] = await pool.query('SELECT email FROM users WHERE id = ?', [store.owner_id]);
    if (!owner || !validEmail(owner.email)) return fail(res, 400, 'Aucune adresse e-mail valide pour le propriétaire.');
    const transport = createNewsletterTransport();
    try {
      await transport.sendMail(previewMessage({ email: owner.email, storeName: store.name, subject, body }));
    } catch (error) {
      console.error('SELLIA e-mail de test:', error);
      return fail(res, 502, 'E-mail de test non envoyé. Vérifie la configuration SMTP.');
    } finally {
      transport.close();
    }
    res.json({ ok: true, email: owner.email });
  } catch (error) { next(error); }
});

app.post('/api/stores/:slug/newsletter/campaigns', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    if (store.plan !== 'premium' || isDemoStore(store)) return fail(res, 403, 'Envoi réservé aux boutiques Premium actives.');
    if (!newsletterMailReady()) return fail(res, 503, 'Le service e-mail n’est pas encore configuré.');
    if (req.body?.confirm !== true) return fail(res, 400, 'Confirme l’envoi de cette campagne.');
    const subject = clean(req.body?.subject, 180).replace(/[\r\n]+/g, ' ');
    const body = newsletterContent(req.body?.body);
    if (subject.length < 3 || body.length < 10) return fail(res, 400, 'Ajoute un objet et un message d’au moins 10 caractères.');
    const [[active]] = await pool.query(
      "SELECT id FROM newsletter_campaigns WHERE store_id = ? AND status = 'sending' LIMIT 1",
      [store.id]
    );
    if (active) return fail(res, 409, 'Une campagne est déjà en cours d’envoi.');
    const [recipients] = await pool.query(
      'SELECT id FROM store_subscribers WHERE store_id = ? AND confirmed_at IS NOT NULL ORDER BY id',
      [store.id]
    );
    if (!recipients.length) return fail(res, 400, 'Aucun abonné confirmé pour cette boutique.');
    const [result] = await pool.query(
      'INSERT INTO newsletter_campaigns (store_id, subject, body, recipient_count) VALUES (?, ?, ?, ?)',
      [store.id, subject, body, recipients.length]
    );
    res.status(202).json({ id: String(result.insertId), status: 'sending', recipientCount: recipients.length });
    void dispatchNewsletterCampaign(result.insertId, store, recipients.map((recipient) => recipient.id));
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') return fail(res, 409, 'Une campagne est déjà en cours d’envoi.');
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = clean(req.body.email, 190).toLowerCase();
    const [[user]] = await pool.query('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email]);
    if (!user || !await bcrypt.compare(String(req.body.password || ''), user.password_hash)) return fail(res, 401, 'Email ou mot de passe incorrect.');
    req.session.userId = user.id;
    await saveSession(req);
    const [[store]] = await pool.query('SELECT id, slug FROM stores WHERE owner_id = ? ORDER BY id LIMIT 1', [user.id]);
    if (!store) return fail(res, 404, 'Aucune boutique n’est associée à ce compte.');
    req.session.activeStoreId = store.id;
    await saveSession(req);
    const payload = await loadBootstrap(store.slug);
    const [firstName, ...lastName] = user.name.split(' ');
    res.json({ ...payload, user: { firstName, lastName: lastName.join(' '), email: user.email, whatsapp: payload.store.whatsapp, plan: payload.store.plan } });
  } catch (error) { next(error); }
});

app.post('/api/auth/signup', async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const firstName = clean(req.body.firstName, 60);
    const lastName = clean(req.body.lastName, 60);
    const email = clean(req.body.email, 190).toLowerCase();
    const whatsapp = clean(req.body.whatsapp, 40);
    const password = String(req.body.password || '');
    if (!firstName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || whatsapp.length < 6 || password.length < 6) return fail(res, 400, 'Vérifie tes informations.');
    const slug = await uniqueSlug(`${firstName}-boutique`, 'stores');
    const initialStoreName = await uniqueStoreName(`${firstName} Boutique`, connection);
    await connection.beginTransaction();
    const [userResult] = await connection.query('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [`${firstName} ${lastName}`.trim(), email, await bcrypt.hash(password, 10)]);
    const [storeResult] = await connection.query(
      'INSERT INTO stores (owner_id, name, slug, category, description, whatsapp, email, plan, onboarding_complete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userResult.insertId, initialStoreName, slug, '', 'Bienvenue dans ma boutique SELLIA.', whatsapp, email, 'basic', false]
    );
    for (const [index, category] of [
      { name: 'Nouveautés', icon: 'package' },
      { name: 'Produits', icon: 'tag' }
    ].entries()) {
      await connection.query('INSERT INTO categories (store_id, name, slug, emoji, sort_order) VALUES (?, ?, ?, ?, ?)', [storeResult.insertId, category.name, slugify(category.name), category.icon, index]);
    }
    await connection.commit();
    req.session.userId = userResult.insertId;
    req.session.activeStoreId = storeResult.insertId;
    await saveSession(req);
    const payload = await loadBootstrap(slug);
    res.status(201).json({ ...payload, user: { firstName, lastName, email, whatsapp, plan: 'basic' } });
  } catch (error) {
    await connection.rollback();
    if (isDuplicateStoreNameError(error)) return fail(res, 409, 'Ce nom de boutique existe déjà. Choisis-en un autre.');
    if (error.code === 'ER_DUP_ENTRY') return fail(res, 409, 'Cet email est déjà utilisé.');
    next(error);
  } finally { connection.release(); }
});

app.post('/api/auth/logout', (req, res) => req.session.destroy(() => res.json({ ok: true })));

app.post('/api/uploads/image', requireSignedIn, upload.single('image'), async (req, res) => {
  if (!req.file) return fail(res, 400, 'Choisis une image à importer.');
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.webp`;
  const outputPath = path.join(uploadDirectory, filename);

  try {
    await sharp(req.file.buffer, {
      failOn: 'error',
      limitInputPixels: 40_000_000
    })
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 84, alphaQuality: 90, effort: 4, smartSubsample: true })
      .toFile(outputPath);

    res.status(201).json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('SELLIA conversion WebP :', error);
    fail(res, 400, 'Impossible de convertir cette image. Essaie avec un autre fichier.');
  }
});

app.post('/api/uploads/hero', requireSignedIn, upload.single('image'), async (req, res) => {
  if (!req.file) return fail(res, 400, 'Choisis une photo d’en-tête à importer.');

  const id = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  const desktopFilename = `${id}-hero-desktop.webp`;
  const mobileFilename = `${id}-hero-mobile.webp`;
  const desktopPath = path.join(uploadDirectory, desktopFilename);
  const mobilePath = path.join(uploadDirectory, mobileFilename);

  try {
    const source = sharp(req.file.buffer, {
      failOn: 'error',
      limitInputPixels: 40_000_000
    }).rotate();
    const metadata = await source.metadata();
    const width = metadata.autoOrient?.width || metadata.width || 0;
    const height = metadata.autoOrient?.height || metadata.height || 0;
    const ratio = height ? width / height : 0;

    if (width < 1200 || height < 600 || ratio < 1.4 || ratio > 2.4) {
      return fail(
        res,
        400,
        `Cette image mesure ${width} × ${height} px et ne convient pas. Taille conseillée : 1920 × 960 px (minimum 1200 × 600 px, format horizontal).`
      );
    }

    const transform = (targetPath, width, height) => sharp(req.file.buffer, {
      failOn: 'error',
      limitInputPixels: 40_000_000
    })
      .rotate()
      .resize({
        width,
        height,
        fit: 'cover',
        position: 'centre'
      })
      .webp({ quality: 86, alphaQuality: 90, effort: 4, smartSubsample: true })
      .toFile(targetPath);

    await Promise.all([
      transform(desktopPath, 1800, 900),
      transform(mobilePath, 900, 1125)
    ]);

    res.status(201).json({
      desktopUrl: `/uploads/${desktopFilename}`,
      mobileUrl: `/uploads/${mobileFilename}`
    });
  } catch (error) {
    await Promise.allSettled([
      fs.promises.rm(desktopPath, { force: true }),
      fs.promises.rm(mobilePath, { force: true })
    ]);
    console.error('SELLIA bannière responsive :', error);
    fail(res, 400, 'Impossible de préparer cette photo. Essaie avec un autre fichier.');
  }
});

app.post('/api/stores/:slug/plan', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    if (!store) return fail(res, 404, 'Boutique introuvable.');
    if (req.body.plan !== 'basic') return fail(res, 403, 'Premium doit être activé par un paiement confirmé.');
    const [[billing]] = await pool.query('SELECT stripe_subscription_id, subscription_status FROM store_billing WHERE store_id = ?', [store.id]);
    if (billing?.stripe_subscription_id && !['canceled', 'incomplete_expired'].includes(billing.subscription_status)) {
      return fail(res, 409, 'Gère cet abonnement depuis le portail de facturation.');
    }
    await pool.query(
      `UPDATE stores
        SET plan='basic', theme='emerald', layout='grid', font='Geist', show_branding=TRUE
        WHERE id=?`,
      [store.id]
    );
    await pool.query('UPDATE products SET promo=FALSE WHERE store_id=?', [store.id]);
    req.session.activeStoreId = store.id;
    res.json(await loadBootstrap(store.slug));
  } catch (error) {
    next(error);
  }
});

app.post('/api/stores/:slug/billing/checkout', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    if (store.plan === 'premium') return fail(res, 409, 'Cette boutique est déjà Premium.');
    const [[owner]] = await pool.query('SELECT email FROM users WHERE id = ?', [store.owner_id]);
    const url = await createPremiumCheckout(store, owner.email, req.body?.returnPath);
    res.json({ url });
  } catch (error) {
    if (error.status) return fail(res, error.status, error.message);
    next(error);
  }
});

app.get('/api/stores/:slug/billing', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    const [[billing]] = await pool.query('SELECT stripe_subscription_id, subscription_status FROM store_billing WHERE store_id = ?', [store.id]);
    res.json({ managedByStripe: Boolean(billing?.stripe_subscription_id), status: billing?.subscription_status || 'not_started' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/stores/:slug/billing/portal', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    const url = await createBillingPortal(store.id);
    res.json({ url });
  } catch (error) {
    if (error.status) return fail(res, error.status, error.message);
    next(error);
  }
});

app.put('/api/stores/:slug', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    if (!store) return fail(res, 404, 'Boutique introuvable.');
    const nextSlug = clean(req.body.slug, 140) || store.slug;
    const nextName = normalizeStoreName(req.body.name) || store.name;
    if (await storeNameExists(nextName, store.id)) {
      return fail(res, 409, 'Ce nom de boutique existe déjà. Choisis-en un autre.');
    }
    const nextTheme = storeThemeIds.has(req.body.theme) ? req.body.theme : 'emerald';
    const nextLayout = req.body.layout === 'list' ? 'list' : 'grid';
    const nextFont = ['Geist', 'Georgia', 'Trebuchet MS'].includes(req.body.font) ? req.body.font : 'Geist';
    const nextShowBranding = Boolean(req.body.showBranding);
    if (store.plan !== 'premium' && nextTheme !== 'emerald') {
      return fail(res, 403, 'Ce thème est réservé au plan SELLIA Premium.');
    }
    if (store.plan !== 'premium' && (nextLayout !== 'grid' || nextFont !== 'Geist')) {
      return fail(res, 403, 'La personnalisation avancée est réservée à SELLIA Premium.');
    }
    if (store.plan !== 'premium' && !nextShowBranding) {
      return fail(res, 403, 'Le retrait du branding SELLIA est réservé au plan Premium.');
    }
    await pool.query(`UPDATE stores SET name=?, slug=?, category=?, description=?, logo=?, cover=?, cover_mobile=?, whatsapp=?, address=?, city=?, country=?, currency=?, instagram=?, tiktok=?, facebook=?, theme=?, layout=?, font=?, hero_title=?, hero_subtitle=?, cta_label=?, show_branding=?, plan=?, verification_status=?, onboarding_complete=? WHERE id=?`, [
      nextName,
      slugify(nextSlug) || store.slug,
      clean(req.body.category, 500) || 'Autres',
      clean(req.body.description, 4000),
      databaseImagePath(req.body.logo) || null,
      databaseImagePath(req.body.cover) || null,
      databaseImagePath(req.body.coverMobile) || null,
      clean(req.body.whatsapp, 40),
      clean(req.body.address, 255),
      clean(req.body.city, 120),
      clean(req.body.country, 100),
      clean(req.body.currency, 12) || '$',
      clean(req.body.instagram, 120),
      clean(req.body.tiktok, 120),
      clean(req.body.facebook, 120),
      nextTheme,
      nextLayout,
      nextFont,
      clean(req.body.heroTitle, 220),
      clean(req.body.heroSubtitle, 4000),
      clean(req.body.ctaLabel, 120) || 'Commander sur WhatsApp',
      nextShowBranding,
      store.plan === 'premium' ? 'premium' : 'basic',
      store.verification_status,
      req.body.onboardingComplete === undefined ? store.onboarding_complete : Boolean(req.body.onboardingComplete),
      store.id
    ]);
    req.session.activeStoreId = store.id;
    res.json(await loadBootstrap(slugify(nextSlug) || store.slug));
  } catch (error) {
    if (isDuplicateStoreNameError(error)) return fail(res, 409, 'Ce nom de boutique existe déjà. Choisis-en un autre.');
    if (error.code === 'ER_DUP_ENTRY') return fail(res, 409, 'Ce lien de boutique est déjà utilisé.');
    next(error);
  }
});

app.post('/api/stores/:slug/categories', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    const name = clean(req.body.name, 100);
    if (!store || !name) return fail(res, 400, 'Catégorie invalide.');
    const icon = clean(req.body.emoji, 16) || 'tag';
    const [result] = await pool.query('INSERT INTO categories (store_id, name, slug, emoji) VALUES (?, ?, ?, ?)', [store.id, name, slugify(name), icon]);
    res.status(201).json({ id: String(result.insertId), name, slug: slugify(name), emoji: icon });
  } catch (error) { next(error); }
});

app.put('/api/stores/:slug/categories/:id', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    const name = clean(req.body.name, 100);
    const icon = clean(req.body.emoji, 16);
    const [result] = await pool.query(
      "UPDATE categories SET name=?, slug=?, emoji=IF(?='', emoji, ?) WHERE id=? AND store_id=?",
      [name, slugify(name), icon, icon, req.params.id, store?.id || 0]
    );
    if (!result.affectedRows) return fail(res, 404, 'Catégorie introuvable.');
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.delete('/api/stores/:slug/categories/:id', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    const [result] = await pool.query('DELETE FROM categories WHERE id=? AND store_id=?', [req.params.id, store?.id || 0]);
    if (!result.affectedRows) return fail(res, 404, 'Catégorie introuvable.');
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.post('/api/stores/:slug/products', requireStoreOwner, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const store = await findStore(req.params.slug);
    if (!store) return fail(res, 404, 'Boutique introuvable.');
    if (store.plan === 'basic' && req.body.promo) {
      return fail(res, 403, 'Les promotions sont réservées à SELLIA Premium.');
    }
    const [[{ count }]] = await connection.query('SELECT COUNT(*) count FROM products WHERE store_id=? AND hidden=0', [store.id]);
    if (store.plan === 'basic' && !req.body.hidden && count >= 5) {
      return fail(res, 403, 'Le plan Basic est limité à 5 produits publiés.');
    }
    const productSlug = await uniqueSlug(req.body.name, 'products', store.id);
    await connection.beginTransaction();
    const [result] = await connection.query('INSERT INTO products (store_id, category_id, name, slug, description, price, old_price, stock, featured, hidden, available, promo, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [store.id, req.body.categoryId || null, clean(req.body.name, 180), productSlug, clean(req.body.description, 4000), Number(req.body.price), req.body.oldPrice ?? null, Number(req.body.stock || 0), Boolean(req.body.featured), Boolean(req.body.hidden), Boolean(req.body.available), Boolean(req.body.promo), 0]);
    await saveVariants(connection, result.insertId, req.body);
    await connection.commit();
    const payload = await loadBootstrap(store.slug);
    res.status(201).json(payload.products.find((item) => item.id === String(result.insertId)));
  } catch (error) { await connection.rollback(); next(error); } finally { connection.release(); }
});

app.put('/api/stores/:slug/products/:id', requireStoreOwner, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const store = await findStore(req.params.slug);
    if (!store) return fail(res, 404, 'Boutique introuvable.');
    const [[product]] = await connection.query(
      'SELECT id FROM products WHERE id=? AND store_id=?',
      [req.params.id, store.id]
    );
    if (!product) return fail(res, 404, 'Produit introuvable.');
    if (store.plan === 'basic' && req.body.promo) {
      return fail(res, 403, 'Les promotions sont réservées à SELLIA Premium.');
    }
    if (store.plan === 'basic' && !req.body.hidden) {
      const [[{ count }]] = await connection.query(
        'SELECT COUNT(*) count FROM products WHERE store_id=? AND hidden=0 AND id<>?',
        [store.id, req.params.id]
      );
      if (count >= 5) {
        return fail(res, 403, 'Le plan Basic est limité à 5 produits publiés.');
      }
    }
    await connection.beginTransaction();
    const [result] = await connection.query('UPDATE products SET category_id=?, name=?, description=?, price=?, old_price=?, stock=?, featured=?, hidden=?, available=?, promo=? WHERE id=? AND store_id=?', [req.body.categoryId || null, clean(req.body.name, 180), clean(req.body.description, 4000), Number(req.body.price), req.body.oldPrice ?? null, Number(req.body.stock || 0), Boolean(req.body.featured), Boolean(req.body.hidden), Boolean(req.body.available), Boolean(req.body.promo), req.params.id, store.id]);
    if (!result.affectedRows) { await connection.rollback(); return fail(res, 404, 'Produit introuvable.'); }
    await saveVariants(connection, req.params.id, req.body);
    await connection.commit();
    res.json({ ok: true });
  } catch (error) { await connection.rollback(); next(error); } finally { connection.release(); }
});

app.delete('/api/stores/:slug/products/:id', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    const [result] = await pool.query('DELETE FROM products WHERE id=? AND store_id=?', [req.params.id, store?.id || 0]);
    if (!result.affectedRows) return fail(res, 404, 'Produit introuvable.');
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.patch('/api/stores/:slug/orders/:id', requireStoreOwner, async (req, res, next) => {
  try {
    const store = await findStore(req.params.slug);
    const statuses = ['nouvelle', 'confirmee', 'preparation', 'expediee', 'livree', 'annulee'];
    if (!statuses.includes(req.body.status)) return fail(res, 400, 'Statut invalide.');
    const [result] = await pool.query('UPDATE orders SET status=? WHERE id=? AND store_id=?', [req.body.status, req.params.id, store?.id || 0]);
    if (!result.affectedRows) return fail(res, 404, 'Commande introuvable.');
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.post('/api/stores/:slug/orders', async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const store = await findStore(req.params.slug);
    if (!store || !Array.isArray(req.body.items) || !req.body.items.length) {
      return fail(res, 400, 'Commande invalide.');
    }

    const requestedItems = req.body.items.map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
      size: clean(item.size, 50) || null,
      color: clean(item.color, 80) || null
    }));

    if (requestedItems.some((item) =>
      !Number.isInteger(item.productId) || item.productId <= 0 ||
      !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99
    )) {
      return fail(res, 400, 'Un produit ou une quantité est invalide.');
    }

    const productIds = [...new Set(requestedItems.map((item) => item.productId))];
    const [catalogProducts] = await connection.query(
      `SELECT
        product.id,
        product.name,
        product.price,
        product.stock,
        product.available,
        product.hidden,
        (
          SELECT image.src
          FROM product_images AS image
          WHERE image.product_id = product.id
          ORDER BY image.sort_order, image.id
          LIMIT 1
        ) AS image
      FROM products AS product
      WHERE product.store_id = ? AND product.id IN (?)`,
      [store.id, productIds]
    );

    if (catalogProducts.length !== productIds.length) {
      return fail(res, 400, 'Un ou plusieurs produits ne sont plus disponibles.');
    }

    const catalogById = new Map(catalogProducts.map((product) => [Number(product.id), product]));
    for (const item of requestedItems) {
      const product = catalogById.get(item.productId);
      if (!product || product.hidden || !product.available || Number(product.stock) <= 0) {
        return fail(res, 409, 'Un ou plusieurs produits ne sont plus disponibles.');
      }
      if (item.quantity > Number(product.stock)) {
        return fail(res, 409, `Stock insuffisant pour ${product.name}.`);
      }
    }

    const orderItems = requestedItems.map((item) => {
      const product = catalogById.get(item.productId);
      return {
        productId: Number(product.id),
        name: product.name,
        price: Number(product.price),
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: databaseImagePath(product.image) || null
      };
    });

    const reference = clean(req.body.reference, 32) ||
      `SL-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await connection.beginTransaction();
    const [result] = await connection.query(
      'INSERT INTO orders (store_id, reference, customer_name, customer_phone, customer_address, city, note, total, status, channel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        store.id,
        reference,
        clean(req.body.customerName, 120),
        clean(req.body.phone, 40),
        clean(req.body.address, 255),
        clean(req.body.city, 120),
        clean(req.body.note, 2000),
        total,
        'nouvelle',
        req.body.channel === 'catalogue' ? 'catalogue' : 'whatsapp'
      ]
    );

    for (const item of orderItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, name, price, quantity, size, color, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          result.insertId,
          item.productId,
          item.name,
          item.price,
          item.quantity,
          item.size,
          item.color,
          item.image
        ]
      );
    }

    await connection.commit();
    res.status(201).json({ id: String(result.insertId), reference, total });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

app.use('/api', (_req, res) => fail(res, 404, 'Route API introuvable.'));
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error instanceof multer.MulterError || error.message?.startsWith('Utilise une image')) {
    return res.status(400).json({ error: error.code === 'LIMIT_FILE_SIZE' ? 'L’image ne doit pas dépasser 8 Mo.' : error.message });
  }
  res.status(500).json({ error: 'Erreur MySQL. Vérifie que WAMP est démarré.' });
});

const port = Number(process.env.API_PORT || 3001);
app.listen(port, '0.0.0.0', () => console.log(`SELLIA API connectée à MySQL : http://localhost:${port}`));
