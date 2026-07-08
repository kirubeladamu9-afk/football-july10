const { verifyToken } = require('./jwt');

function requireAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.cookies?.admin_token;

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

module.exports = requireAuth;
