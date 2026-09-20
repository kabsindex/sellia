import assert from 'node:assert/strict';
import test from 'node:test';
import { invoiceSubscriptionId, subscriptionIsPremium } from './stripe-billing.js';

const subscription = (status, price = 'price_premium') => ({
  status,
  items: { data: [{ price: { id: price } }] }
});

test('Premium requires an active subscription on the configured price', () => {
  assert.equal(subscriptionIsPremium(subscription('active'), 'price_premium'), true);
  assert.equal(subscriptionIsPremium(subscription('trialing'), 'price_premium'), true);
  assert.equal(subscriptionIsPremium(subscription('past_due'), 'price_premium'), false);
  assert.equal(subscriptionIsPremium(subscription('canceled'), 'price_premium'), false);
  assert.equal(subscriptionIsPremium(subscription('active', 'price_other'), 'price_premium'), false);
});

test('invoice subscription IDs work with current and legacy event shapes', () => {
  assert.equal(invoiceSubscriptionId({
    parent: { subscription_details: { subscription: 'sub_current' } }
  }), 'sub_current');
  assert.equal(invoiceSubscriptionId({ subscription: 'sub_legacy' }), 'sub_legacy');
  assert.equal(invoiceSubscriptionId({}), null);
});
