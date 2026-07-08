import { verifyToken } from '../../../../lib/jwt';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ authenticated: false });
    }

    return res.status(200).json({
      authenticated: true,
      user: decoded,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;
