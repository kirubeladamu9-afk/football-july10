import { query } from './db';
import bcrypt from 'bcryptjs';

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';
const SESSION_COOKIE_NAME = 'admin_session';

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function authenticate(email, password) {
  try {
    const result = await query(
      'SELECT id, email, name, password_hash FROM admin_users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function getUserById(id) {
  try {
    const result = await query(
      'SELECT id, email, name FROM admin_users WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export function createSessionToken(userId) {
  // Simple base64 encoding for demo - use JWT or signed tokens in production
  const payload = JSON.stringify({
    userId,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  return Buffer.from(payload).toString('base64');
}

export function parseSessionToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
