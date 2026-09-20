import nodemailer from 'nodemailer';

function publicBaseUrl() {
  try {
    const url = new URL(process.env.PUBLIC_APP_URL || '');
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === 'localhost')) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function newsletterMailReady() {
  const port = Number(process.env.SMTP_PORT || 587);
  return Boolean(
    process.env.SMTP_HOST &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.SMTP_FROM || '') &&
    Number.isInteger(port) && port > 0 && port <= 65535 &&
    publicBaseUrl() &&
    Boolean(process.env.SMTP_USER) === Boolean(process.env.SMTP_PASSWORD)
  );
}

export function newsletterUrl(path) {
  const base = publicBaseUrl();
  if (!base) throw new Error('PUBLIC_APP_URL doit être une adresse HTTPS stable.');
  return `${base}${path}`;
}

export function createNewsletterTransport() {
  if (!newsletterMailReady()) throw new Error('Le service e-mail n’est pas configuré.');
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465 && !['localhost', '127.0.0.1'].includes(process.env.SMTP_HOST),
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
    pool: true,
    maxConnections: 2,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 30000
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function sender(name) {
  return { name, address: process.env.SMTP_FROM };
}

export function confirmationMessage({ email, storeName, token }) {
  const url = newsletterUrl(`/confirmation/${token}`);
  const safeName = escapeHtml(storeName);
  return {
    from: sender('SELLIA'),
    to: email,
    subject: `Confirme ton inscription à ${storeName}`,
    text: `Confirme ton inscription aux nouveautés de ${storeName} : ${url}\n\nSi tu n'as rien demandé, ignore ce message.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:28px;color:#17221b"><h1 style="font-size:24px">Confirme ton inscription</h1><p>Tu as demandé à recevoir les nouveautés de <strong>${safeName}</strong>.</p><p><a href="${url}" style="display:inline-block;padding:12px 18px;background:#11834e;color:#fff;text-decoration:none;border-radius:6px">Confirmer mon adresse</a></p><p style="font-size:13px;color:#65736a">Si tu n'as rien demandé, ignore ce message.</p></div>`
  };
}

export function campaignMessage({ email, storeName, storeSlug, subject, body, unsubscribeToken, replyTo }) {
  const unsubscribeUrl = newsletterUrl(`/desabonnement/${unsubscribeToken}`);
  const oneClickUrl = newsletterUrl(`/api/newsletter/unsubscribe/${unsubscribeToken}`);
  const storeUrl = newsletterUrl(`/${encodeURIComponent(storeSlug)}`);
  const safeName = escapeHtml(storeName);
  const safeBody = escapeHtml(body).replace(/\n/g, '<br>');
  return {
    from: sender(storeName),
    to: email,
    replyTo: replyTo || undefined,
    subject,
    text: `${body}\n\nVoir la boutique : ${storeUrl}\n\n${storeName}\nSe désabonner : ${unsubscribeUrl}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;color:#17221b"><p style="font-weight:700">${safeName}</p><div style="line-height:1.6;white-space:normal">${safeBody}</div><p style="margin:28px 0"><a href="${storeUrl}" style="display:inline-block;padding:12px 18px;background:#11834e;color:#fff;text-decoration:none;border-radius:6px">Voir la boutique</a></p><hr style="margin:32px 0;border:0;border-top:1px solid #e4e9e5"><p style="font-size:12px;color:#65736a">Tu reçois cet e-mail parce que tu t'es abonné aux nouveautés de ${safeName}. <a href="${unsubscribeUrl}">Se désabonner</a>.</p></div>`,
    list: { unsubscribe: oneClickUrl },
    headers: { 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' }
  };
}

export function previewMessage({ email, storeName, subject, body }) {
  const safeName = escapeHtml(storeName);
  const safeBody = escapeHtml(body).replace(/\n/g, '<br>');
  return {
    from: sender(storeName),
    to: email,
    subject: `[Test] ${subject}`,
    text: `Aperçu de campagne pour ${storeName}\n\n${body}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;color:#17221b"><p style="font-size:12px;color:#65736a">E-mail de test, envoyé uniquement à toi.</p><p style="font-weight:700">${safeName}</p><div style="line-height:1.6">${safeBody}</div></div>`
  };
}
