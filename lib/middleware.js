import { parseSessionToken, getUserById } from './auth';

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
  const token = getCookie(req.headers.cookie, 'admin_session');

  if (!token) {
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
    `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${24 * 60 * 60}`
  );
}
