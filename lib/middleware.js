import { parseSessionToken, getUserById } from './auth';

export function setCorsHeaders(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export function getCookie(cookieString, name) {
  if (!cookieString) return null;
  const cookies = cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
  return cookies[name];
}

export async function requireAuth(req) {
  const cookieString = req.headers.cookie;
  console.log('Debug: Received cookies:', cookieString ? 'present' : 'missing');
  const token = getCookie(cookieString, 'admin_session');

  if (!token) {
    console.log('Debug: No admin_session token found');
    return null;
  }

  const session = parseSessionToken(token);
  if (!session) {
    return null;
  }

  const user = await getUserById(session.userId);
  return user;
}

export function setSessionCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    `admin_session=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${24 * 60 * 60}`
  );
}
