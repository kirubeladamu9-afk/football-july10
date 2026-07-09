import { requireAuth, setCorsHeaders } from '@/lib/middleware';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  const user = await requireAuth(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    try {
      const { name, email, currentPassword, newPassword } = req.body;

      if (newPassword && currentPassword) {
        const userResult = await query('SELECT password_hash FROM admin_users WHERE id = ?', [user.id]);

        if (!userResult.rows || !userResult.rows[0]) {
          return res.status(404).json({ error: 'User not found' });
        }

        const storedPassword = userResult.rows[0].password_hash;
        if (!storedPassword) {
          return res.status(500).json({ error: 'User password not found in database' });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, storedPassword);
        if (!passwordMatch) {
          return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hashedPassword, user.id]);
      }

      if (name || email) {
        const updates = [];
        const values = [];

        if (name) {
          updates.push('name = ?');
          values.push(name);
        }

        if (email) {
          updates.push('email = ?');
          values.push(email);
        }

        if (updates.length > 0) {
          values.push(user.id);
          await query(`UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`, values);
        }
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ error: error?.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
