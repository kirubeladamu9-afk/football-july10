import { authenticate, createSessionToken } from '@/lib/auth';
import { setSessionCookie, setCorsHeaders } from '@/lib/middleware';

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await authenticate(email, password);

    if (!user) {
      return res.status(401).json({ error: 'invalidCredentials' });
    }

    const token = createSessionToken(user.id);
    setSessionCookie(res, token);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}
