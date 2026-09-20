import crypto from 'node:crypto';
import process from 'node:process';
import Stripe from 'stripe';
import { pool } from './db.js';

let stripeClient;

function configurationError(message) {
  const error = new Error(message);
  error.status = 503;
  return error;
}

function stripe() {
  if (!process.env.STRIPE_API_KEY) {
    throw configurationError('Le paiement Stripe n’est pas encore configuré.');
  }
  stripeClient ??= new Stripe(process.env.STRIPE_API_KEY);
  return stripeClient;
}

function publicAppUrl() {
  const value = process.env.PUBLIC_APP_URL;
  if (!value) throw configurationError('PUBLIC_APP_URL doit être configurée pour le paiement Stripe.');
  let url;
  try {
    url = new URL(value);
  } catch {
    throw configurationError('PUBLIC_APP_URL est invalide.');
  }
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
    throw configurationError('PUBLIC_APP_URL doit utiliser HTTPS.');
  }
  return url.origin;
}

function premiumPriceId() {
  if (!process.env.STRIPE_PREMIUM_PRICE_ID) {
    throw configurationError('Le tarif Stripe Premium n’est pas encore configuré.');
  }
  return process.env.STRIPE_PREMIUM_PRICE_ID;
}

function subscriptionId(value) {
  return typeof value === 'string' ? value : value?.id || null;
}

export function invoiceSubscriptionId(invoice) {
  return subscriptionId(invoice.parent?.subscription_details?.subscription || invoice.subscription);
}

export function subscriptionIsPremium(subscription, priceId) {
  return ['active', 'trialing'].includes(subscription.status) &&
    subscription.items?.data?.some((item) => item.price?.id === priceId) === true;
}

async function billingForStore(storeId) {
  const [[billing]] = await pool.query('SELECT * FROM store_billing WHERE store_id = ?', [storeId]);
  return billing || null;
}

async function customerForStore(store, email) {
  const billing = await billingForStore(store.id);
  if (billing?.stripe_customer_id) return billing.stripe_customer_id;

  const customer = await stripe().customers.create({
    email,
    name: store.name,
    metadata: { sellia_store_id: String(store.id) }
  }, { idempotencyKey: `sellia-store-${store.id}-customer` });
  await pool.query(
    `INSERT INTO store_billing (store_id, stripe_customer_id) VALUES (?, ?)
      ON DUPLICATE KEY UPDATE stripe_customer_id = COALESCE(stripe_customer_id, VALUES(stripe_customer_id))`,
    [store.id, customer.id]
  );
  return (await billingForStore(store.id)).stripe_customer_id;
}

export async function createPremiumCheckout(store, email, requestedReturnPath) {
  const client = stripe();
  const priceId = premiumPriceId();
  const appUrl = publicAppUrl();
  const returnPath = requestedReturnPath === '/onboarding' ||
    /^\/dashboard(?:\/[a-z0-9/-]+)?$/.test(requestedReturnPath || '')
    ? requestedReturnPath
    : '/dashboard/parametres';
  const price = await client.prices.retrieve(priceId);
  if (!price.active || price.currency !== 'usd' || price.unit_amount !== 900 ||
      price.recurring?.interval !== 'month' || price.recurring?.interval_count !== 1) {
    throw configurationError('Le tarif Stripe Premium doit être actif et fixé à 9 USD par mois.');
  }

  const customer = await customerForStore(store, email);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[billing]] = await connection.query(
      'SELECT checkout_session_id, subscription_status FROM store_billing WHERE store_id = ? FOR UPDATE',
      [store.id]
    );
    const subscriptions = await client.subscriptions.list({ customer, status: 'all', limit: 100 });
    if (subscriptions.data.some((item) => ['active', 'trialing', 'past_due', 'unpaid', 'incomplete'].includes(item.status))) {
      const error = new Error('Un abonnement existe déjà. Gère-le depuis le portail de facturation.');
      error.status = 409;
      throw error;
    }
    if (billing.checkout_session_id) {
      const previous = await client.checkout.sessions.retrieve(billing.checkout_session_id);
      if (previous.status === 'open' && previous.url) {
        await connection.commit();
        return previous.url;
      }
      if (previous.status === 'complete' && !['canceled', 'incomplete_expired'].includes(billing.subscription_status)) {
        const error = new Error('Ton paiement est en cours de confirmation. Réessaie dans quelques instants.');
        error.status = 409;
        throw error;
      }
    }

    const tag = Array.from(crypto.randomBytes(8), (byte) => String.fromCharCode(97 + byte % 26)).join('');
    const session = await client.checkout.sessions.create({
      mode: 'subscription',
      customer,
      client_reference_id: String(store.id),
      line_items: [{ price: priceId, quantity: 1 }],
      integration_identifier: `sellia_${tag}`,
      success_url: `${appUrl}${returnPath}?stripe=success`,
      cancel_url: `${appUrl}${returnPath}?stripe=cancel`
    });
    await connection.query('UPDATE store_billing SET checkout_session_id = ? WHERE store_id = ?', [session.id, store.id]);
    await connection.commit();
    return session.url;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function createBillingPortal(storeId) {
  const billing = await billingForStore(storeId);
  if (!billing?.stripe_customer_id) {
    const error = new Error('Aucun abonnement Stripe n’est lié à cette boutique.');
    error.status = 404;
    throw error;
  }
  const session = await stripe().billingPortal.sessions.create({
    customer: billing.stripe_customer_id,
    return_url: `${publicAppUrl()}/dashboard/parametres`
  });
  return session.url;
}

async function applySubscriptionEvent(event, subscription, customerId, allowReplacement) {
  const premium = subscriptionIsPremium(subscription, premiumPriceId());
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [insert] = await connection.query(
      'INSERT IGNORE INTO stripe_webhook_events (event_id, event_type) VALUES (?, ?)',
      [event.id, event.type]
    );
    if (!insert.affectedRows) {
      await connection.commit();
      return;
    }
    const [[billing]] = await connection.query(
      'SELECT store_id, stripe_subscription_id FROM store_billing WHERE stripe_customer_id = ? FOR UPDATE',
      [customerId]
    );
    if (!billing) throw new Error('Client Stripe sans boutique Sellia liée.');
    if (billing.stripe_subscription_id && billing.stripe_subscription_id !== subscription.id && !allowReplacement) {
      await connection.commit();
      return;
    }
    await connection.query(
      'UPDATE store_billing SET stripe_subscription_id = ?, subscription_status = ? WHERE store_id = ?',
      [subscription.id, subscription.status, billing.store_id]
    );
    await connection.query(
      `UPDATE stores SET plan = ?,
        theme = IF(? = 'premium', theme, 'emerald'),
        layout = IF(? = 'premium', layout, 'grid'),
        font = IF(? = 'premium', font, 'Geist'),
        show_branding = IF(? = 'premium', show_branding, TRUE)
        WHERE id = ?`,
      [premium ? 'premium' : 'basic', premium ? 'premium' : 'basic', premium ? 'premium' : 'basic',
        premium ? 'premium' : 'basic', premium ? 'premium' : 'basic', billing.store_id]
    );
    if (!premium) {
      await connection.query('UPDATE products SET promo = FALSE WHERE store_id = ?', [billing.store_id]);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function handleStripeWebhook(rawBody, signature) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw configurationError('Le secret du webhook Stripe n’est pas configuré.');
  }
  const client = stripe();
  const event = client.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  const testKey = /^(sk|rk)_test_/.test(process.env.STRIPE_API_KEY);
  if (event.livemode === testKey) throw new Error('Environnement Stripe incompatible avec la clé configurée.');

  let id;
  let customer;
  let allowReplacement = false;
  if (['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) {
    if (event.data.object.mode !== 'subscription') return;
    id = subscriptionId(event.data.object.subscription);
    customer = subscriptionId(event.data.object.customer);
    allowReplacement = true;
  } else if (event.type.startsWith('customer.subscription.')) {
    id = event.data.object.id;
    customer = subscriptionId(event.data.object.customer);
  } else if (['invoice.paid', 'invoice.payment_failed'].includes(event.type)) {
    id = invoiceSubscriptionId(event.data.object);
    customer = subscriptionId(event.data.object.customer);
  } else {
    return;
  }
  if (!id || !customer) return;
  const subscription = await client.subscriptions.retrieve(id);
  await applySubscriptionEvent(event, subscription, customer, allowReplacement);
}
