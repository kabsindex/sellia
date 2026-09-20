import 'dotenv/config';
import mysql from 'mysql2/promise';

const database = process.env.DB_NAME || 'sellia';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
});

export function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

export async function uniqueSlug(base, table, storeId = null) {
  const root = slugify(base) || 'boutique';
  let candidate = root;
  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const sql = table === 'stores'
      ? 'SELECT id FROM stores WHERE slug = ?'
      : 'SELECT id FROM products WHERE store_id = ? AND slug = ?';
    const params = table === 'stores' ? [candidate] : [storeId, candidate];
    const [[row]] = await pool.query(sql, params);
    if (!row) return candidate;
    candidate = `${root}-${suffix}`;
  }
  throw new Error('Impossible de créer un lien unique.');
}
