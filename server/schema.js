import bcrypt from 'bcryptjs';
import { pool } from './db.js';

async function addColumn(table, definition) {
  const column = definition.trim().split(/\s+/, 1)[0];
  if (!/^[a-z_]+$/i.test(table) || !/^[a-z_]+$/i.test(column)) {
    throw new Error('Nom de colonne invalide.');
  }
  const [[existing]] = await pool.query(
    'SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
    [table, column]
  );
  if (!existing) {
    await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN ${definition}`);
  }
}

export async function ensureSchema() {
  await pool.query(`CREATE TABLE IF NOT EXISTS store_billing (
    store_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    stripe_customer_id VARCHAR(255) NULL UNIQUE,
    stripe_subscription_id VARCHAR(255) NULL UNIQUE,
    subscription_status VARCHAR(40) NOT NULL DEFAULT 'not_started',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  await addColumn('store_billing', 'checkout_session_id VARCHAR(255) NULL');
  await pool.query(`CREATE TABLE IF NOT EXISTS stripe_webhook_events (
    event_id VARCHAR(255) NOT NULL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  await pool.query(`CREATE TABLE IF NOT EXISTS store_visits (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT UNSIGNED NOT NULL,
    visitor_key VARCHAR(80) NOT NULL,
    visited_on DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_daily_visit (store_id, visitor_key, visited_on),
    KEY store_visit_date (store_id, visited_on)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  await pool.query(`CREATE TABLE IF NOT EXISTS store_subscribers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT UNSIGNED NOT NULL,
    email VARCHAR(254) NOT NULL,
    unsubscribe_token CHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_store_subscriber (store_id, email),
    UNIQUE KEY unique_unsubscribe_token (unsubscribe_token),
    KEY subscriber_store_date (store_id, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  await addColumn('store_subscribers', 'confirmed_at DATETIME NULL');
  await addColumn('store_subscribers', 'confirmation_token CHAR(64) NULL');
  await addColumn('store_subscribers', 'confirmation_sent_at DATETIME NULL');
  const [[confirmationIndex]] = await pool.query(
    "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'store_subscribers' AND INDEX_NAME = 'unique_confirmation_token'"
  );
  if (!confirmationIndex) {
    await pool.query('ALTER TABLE store_subscribers ADD UNIQUE KEY unique_confirmation_token (confirmation_token)');
  }
  await pool.query(`CREATE TABLE IF NOT EXISTS newsletter_campaigns (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT UNSIGNED NOT NULL,
    subject VARCHAR(180) NOT NULL,
    body TEXT NOT NULL,
    status ENUM('sending','sent','partial','failed','interrupted') NOT NULL DEFAULT 'sending',
    recipient_count INT UNSIGNED NOT NULL DEFAULT 0,
    sent_count INT UNSIGNED NOT NULL DEFAULT 0,
    failed_count INT UNSIGNED NOT NULL DEFAULT 0,
    skipped_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at DATETIME NULL,
    KEY campaign_store_date (store_id, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  await pool.query("UPDATE newsletter_campaigns SET status = 'interrupted', finished_at = NOW() WHERE status = 'sending'");
  await addColumn('newsletter_campaigns', "active_store_id BIGINT UNSIGNED GENERATED ALWAYS AS (CASE WHEN status = 'sending' THEN store_id ELSE NULL END) STORED");
  const [[activeCampaignIndex]] = await pool.query(
    "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'newsletter_campaigns' AND INDEX_NAME = 'one_active_newsletter_campaign'"
  );
  if (!activeCampaignIndex) {
    await pool.query('ALTER TABLE newsletter_campaigns ADD UNIQUE KEY one_active_newsletter_campaign (active_store_id)');
  }
  await addColumn('stores', "city VARCHAR(120) NOT NULL DEFAULT ''");
  await addColumn('stores', `name_unique_key VARCHAR(170) GENERATED ALWAYS AS (
    CASE
      WHEN slug = 'novamarket-premium' THEN CONCAT(LOWER(TRIM(name)), '#premium-demo')
      ELSE LOWER(TRIM(name))
    END
  ) STORED`);
  await addColumn('stores', 'cover_mobile VARCHAR(500) NULL');
  await addColumn('stores', "currency VARCHAR(12) NOT NULL DEFAULT '$'");
  await addColumn('stores', "instagram VARCHAR(120) NOT NULL DEFAULT ''");
  await addColumn('stores', "tiktok VARCHAR(120) NOT NULL DEFAULT ''");
  await addColumn('stores', "facebook VARCHAR(120) NOT NULL DEFAULT ''");
  await addColumn('stores', "theme ENUM('emerald','midnight','sand','coral') NOT NULL DEFAULT 'emerald'");
  await addColumn('stores', "layout ENUM('grid','list') NOT NULL DEFAULT 'grid'");
  await addColumn('stores', "font VARCHAR(40) NOT NULL DEFAULT 'Geist'");
  await addColumn('stores', "hero_title VARCHAR(220) NOT NULL DEFAULT ''");
  await addColumn('stores', "hero_subtitle TEXT NULL");
  await addColumn('stores', "cta_label VARCHAR(120) NOT NULL DEFAULT 'Commander sur WhatsApp'");
  await addColumn('stores', 'show_branding BOOLEAN NOT NULL DEFAULT TRUE');
  await addColumn('stores', 'onboarding_complete BOOLEAN NOT NULL DEFAULT TRUE');
  await addColumn('categories', "emoji VARCHAR(16) NOT NULL DEFAULT '🏷️'");
  await addColumn('products', 'available BOOLEAN NOT NULL DEFAULT TRUE');
  await addColumn('products', 'promo BOOLEAN NOT NULL DEFAULT FALSE');
  await addColumn('products', 'views INT UNSIGNED NOT NULL DEFAULT 0');
  await addColumn('orders', "city VARCHAR(120) NOT NULL DEFAULT ''");
  await addColumn('orders', "channel ENUM('whatsapp','catalogue') NOT NULL DEFAULT 'whatsapp'");
  await pool.query("ALTER TABLE stores MODIFY category VARCHAR(500) NOT NULL DEFAULT 'Autres'");
  await pool.query("ALTER TABLE stores MODIFY theme ENUM('emerald','midnight','sand','coral','noir','royal','rose','nordic') NOT NULL DEFAULT 'emerald'");
  await pool.query("UPDATE stores SET theme = 'emerald', layout = 'grid', font = 'Geist', show_branding = TRUE WHERE plan = 'basic'");
  await pool.query(`UPDATE products AS product
    INNER JOIN stores AS store ON store.id = product.store_id
    SET product.promo = FALSE
    WHERE store.plan = 'basic' AND product.promo = TRUE`);
  const [[storeNameIndex]] = await pool.query(
    "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'stores' AND INDEX_NAME = 'unique_store_name'"
  );
  if (!storeNameIndex) {
    await pool.query('ALTER TABLE stores ADD UNIQUE KEY unique_store_name (name_unique_key)');
  }

  await pool.query("ALTER TABLE orders MODIFY status ENUM('pending','confirmed','delivered','cancelled','nouvelle','confirmee','preparation','expediee','livree','annulee') NOT NULL DEFAULT 'nouvelle'");
  await pool.query("UPDATE orders SET status = CASE status WHEN 'pending' THEN 'nouvelle' WHEN 'confirmed' THEN 'confirmee' WHEN 'delivered' THEN 'livree' WHEN 'cancelled' THEN 'annulee' ELSE status END");
  await pool.query("ALTER TABLE orders MODIFY status ENUM('nouvelle','confirmee','preparation','expediee','livree','annulee') NOT NULL DEFAULT 'nouvelle'");

  const email = 'grace@novamarket.demo';
  const passwordHash = await bcrypt.hash('demo1234', 10);
  await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash)',
    ['Grâce Mukendi', email, passwordHash]
  );
  const [[user]] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  await pool.query('UPDATE stores SET owner_id = ? WHERE slug IN (?, ?)', [user.id, 'novamarket', 'novamarket-premium']);
  await pool.query(`UPDATE categories AS category
    INNER JOIN stores AS store ON store.id = category.store_id
    SET category.emoji = CASE category.slug
      WHEN 'sneakers' THEN 'sneaker'
      WHEN 't-shirts' THEN 'shirt'
      WHEN 'sacs' THEN 'shopping-bag'
      WHEN 'montres' THEN 'watch'
      ELSE category.emoji
    END
    WHERE store.slug IN ('novamarket', 'novamarket-premium')
      AND category.slug IN ('sneakers', 't-shirts', 'sacs', 'montres')`);
  await pool.query(`UPDATE stores
    SET cover = '/48b850d9-ac65-4221-8323-b548f4933f40.jpg'
    WHERE slug IN ('novamarket', 'novamarket-premium')
      AND (cover IS NULL OR cover = '' OR cover = '/cover.jpg')`);
  await pool.query(`UPDATE stores
    SET hero_title = 'Le dressing complet pour ton style', hero_subtitle = description
    WHERE slug IN ('novamarket', 'novamarket-premium') AND hero_title = ''`);
  await pool.query(`UPDATE product_images SET src = CASE src
    WHEN '/products/air-force-1-07.avif' THEN '/products/catalog-air-force-white.webp'
    WHEN './products/air-force-1-07.avif' THEN '/products/catalog-air-force-white.webp'
    WHEN '/products/air-force-1-black.webp' THEN '/products/catalog-air-force-black.webp'
    WHEN './products/air-force-1-black.webp' THEN '/products/catalog-air-force-black.webp'
    WHEN '/products/new-balance-530.jpg' THEN '/products/catalog-new-balance-silver.webp'
    WHEN './products/new-balance-530.jpg' THEN '/products/catalog-new-balance-silver.webp'
    WHEN '/products/t-shirt-casa-blanca.webp' THEN '/products/catalog-mediterranean-tee.webp'
    WHEN './products/t-shirt-casa-blanca.webp' THEN '/products/catalog-mediterranean-tee.webp'
    WHEN '/products/sac-femme.jpg' THEN '/products/catalog-taupe-handbag.webp'
    WHEN './products/sac-femme.jpg' THEN '/products/catalog-taupe-handbag.webp'
    WHEN '/products/rolex-datejust.jpg' THEN '/products/catalog-two-tone-watch.webp'
    WHEN './products/rolex-datejust.jpg' THEN '/products/catalog-two-tone-watch.webp'
    WHEN '/products/jordan-black-cat.webp' THEN '/products/catalog-black-cat.webp'
    WHEN './products/jordan-black-cat.webp' THEN '/products/catalog-black-cat.webp'
    WHEN '/products/air-jordan-4-bred.jpg' THEN '/products/catalog-jordan-bred.webp'
    WHEN './products/air-jordan-4-bred.jpg' THEN '/products/catalog-jordan-bred.webp'
    ELSE src END
    WHERE src IN (
      '/products/air-force-1-07.avif', '/products/air-force-1-black.webp',
      '/products/new-balance-530.jpg', '/products/t-shirt-casa-blanca.webp',
      '/products/sac-femme.jpg', '/products/rolex-datejust.jpg',
      '/products/jordan-black-cat.webp', '/products/air-jordan-4-bred.jpg',
      './products/air-force-1-07.avif', './products/air-force-1-black.webp',
      './products/new-balance-530.jpg', './products/t-shirt-casa-blanca.webp',
      './products/sac-femme.jpg', './products/rolex-datejust.jpg',
      './products/jordan-black-cat.webp', './products/air-jordan-4-bred.jpg'
    )`);
}
