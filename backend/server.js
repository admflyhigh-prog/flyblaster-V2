/* ============================================================
   Fly Blaster — Local Node.js Backend
   Replaces: Supabase (database + auth) + n8n (campaign engine)
   Talks to: MySQL (dedicated flyblaster container) + WAHA (WhatsApp API)
   ============================================================ */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors({
  origin: (process.env.FRONTEND_ORIGIN || 'http://localhost:8090').split(','),
  credentials: true
}));

/* ---------------- Config ---------------- */
const PORT = process.env.PORT || 8091;
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'flyblaster';
const WAHA_BASE_URL = process.env.WAHA_BASE_URL || 'http://150.109.5.90:3000';
const WAHA_API_KEY = process.env.WAHA_API_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'flyblaster-local-secret-change-me';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@flyblaster.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/* ---------------- MySQL pool ---------------- */
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  dateStrings: true
});

/* ---------------- Helpers ---------------- */
function cleanPhone(phone) {
  let cleaned = String(phone || '').replace(/[\s\-\(\)]/g, '');
  let digits = cleaned.replace(/\D/g, '');
  if (cleaned.startsWith('+')) return '+' + digits;
  if (digits.startsWith('0')) return '+60' + digits.substring(1);
  return '+' + digits;
}

function normalizeJidToPhone(jid) {
  // e.g. "60123456789@s.whatsapp.net" or "60123456789@c.us" -> "+60123456789"
  const num = String(jid || '').split('@')[0].replace(/\D/g, '');
  if (!num) return null;
  return '+' + num;
}

function phoneToJid(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return `${digits}@c.us`;
}

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

/* ---------------- WAHA client ---------------- */
async function wahaRequest(path, { method = 'GET', body, timeout = 30000 } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (WAHA_API_KEY) headers['X-Api-Key'] = WAHA_API_KEY;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${WAHA_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch (_) { json = text; }
    if (!res.ok) {
      const err = new Error(`WAHA ${res.status}: ${typeof json === 'string' ? json : JSON.stringify(json)}`);
      err.status = res.status;
      throw err;
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------- Ensure default admin user ---------------- */
async function ensureAdmin() {
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL]);
  if (rows.length === 0) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await pool.query(
      'INSERT INTO users (email, password_hash, display_name, role) VALUES (?, ?, ?, ?)',
      [ADMIN_EMAIL, hash, 'Admin', 'admin']
    );
    console.log(`[boot] Created default admin user: ${ADMIN_EMAIL}`);
  }
}

/* ---------------- Server boot ---------------- */
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'connected', time: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, db: 'error', error: e.message });
  }
});

app.listen(PORT, async () => {
  console.log(`[boot] Fly Blaster backend listening on :${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log(`[boot] MySQL connected (${DB_HOST}:${DB_PORT}/${DB_NAME})`);
    await ensureAdmin();
  } catch (e) {
    console.error('[boot] DB connection failed:', e.message);
  }
});

// Export for route modules (loaded after listen to avoid ordering issues)
module.exports = { app, pool, wahaRequest, cleanPhone, phoneToJid, normalizeJidToPhone, signToken, authRequired, WAHA_BASE_URL };

// Load routes
require('./routes/auth');
require('./routes/core');
require('./routes/waha');
require('./routes/campaigns');
