import pool from '../../../../lib/db';
import { signToken } from '../../../../lib/jwt';
import bcrypt from 'bcryptjs';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute(
        'SELECT id, email, password_hash, name, role FROM admin_users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = signToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      res.setHeader(
        'Set-Cookie',
        `admin_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`
      );

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler;
