import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import nodemailer from 'nodemailer';
import {
  campaignMessage,
  confirmationMessage,
  newsletterMailReady,
  newsletterUrl
} from './newsletter-mailer.js';

const keys = ['PUBLIC_APP_URL', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'];
const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

before(() => {
  process.env.PUBLIC_APP_URL = 'https://sellia.example';
  process.env.SMTP_HOST = 'smtp.example';
  process.env.SMTP_PORT = '587';
  process.env.SMTP_USER = 'sender';
  process.env.SMTP_PASSWORD = 'secret';
  process.env.SMTP_FROM = 'nouvelles@sellia.example';
});

after(() => {
  for (const key of keys) {
    if (previous[key] === undefined) delete process.env[key];
    else process.env[key] = previous[key];
  }
});

test('mailer needs a stable public URL and SMTP configuration', () => {
  assert.equal(newsletterMailReady(), true);
  delete process.env.SMTP_FROM;
  assert.equal(newsletterMailReady(), false);
  process.env.SMTP_FROM = 'nouvelles@sellia.example';
  process.env.PUBLIC_APP_URL = 'http://example.com';
  assert.equal(newsletterMailReady(), false);
  process.env.PUBLIC_APP_URL = 'https://sellia.example';
});

test('confirmation message contains the confirmation URL and escapes the store name', () => {
  const mail = confirmationMessage({ email: 'client@example.com', storeName: '<Ma boutique>', token: 'a'.repeat(64) });
  assert.match(mail.text, /https:\/\/sellia\.example\/confirmation\/a{64}/);
  assert.match(mail.html, /&lt;Ma boutique&gt;/);
  assert.doesNotMatch(mail.html, /<Ma boutique>/);
});

test('campaign message contains storefront and unsubscribe links without exposing other recipients', () => {
  const mail = campaignMessage({
    email: 'client@example.com',
    storeName: 'Ma boutique',
    storeSlug: 'ma-boutique',
    subject: 'Nouveautés',
    body: '<script>alert(1)</script>',
    unsubscribeToken: 'b'.repeat(64)
  });
  assert.equal(mail.to, 'client@example.com');
  assert.match(mail.text, /https:\/\/sellia\.example\/ma-boutique/);
  assert.match(mail.text, /https:\/\/sellia\.example\/desabonnement\/b{64}/);
  assert.equal(mail.list.unsubscribe, newsletterUrl(`/api/newsletter/unsubscribe/${'b'.repeat(64)}`));
  assert.equal(mail.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
  assert.doesNotMatch(mail.html, /<script>/);
});

test('generated email includes one-click unsubscribe headers', async () => {
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
  const mail = campaignMessage({
    email: 'client@example.com',
    storeName: 'Ma boutique',
    storeSlug: 'ma-boutique',
    subject: 'Nouveautés',
    body: 'Voici les nouveautés',
    unsubscribeToken: 'c'.repeat(64)
  });
  const result = await transport.sendMail(mail);
  const message = result.message.toString().replace(/\r\n[ \t]+/g, ' ');
  assert.match(message, /List-Unsubscribe: <https:\/\/sellia\.example\/api\/newsletter\/unsubscribe\/c{64}>/);
  assert.match(message, /List-Unsubscribe-Post: List-Unsubscribe=One-Click/);
});
