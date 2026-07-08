require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const getPoolConfig = () => {
  const dbUrl = process.env.MYSQL_URL;

  if (dbUrl) {
    const url = new URL(dbUrl);
    return {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: parseInt(url.port || '3306'),
    };
  }

  return {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQLPORT || '3306'),
  };
};

async function resetAdmin() {
  const pool = mysql.createPool({
    ...getPoolConfig(),
    charset: 'utf8mb4',
  });

  const connection = await pool.getConnection();
  try {
    // Get existing admin user
    const [existingUsers] = await connection.execute(
      'SELECT id FROM admin_users WHERE email = ?',
      ['admin@football.com']
    );

    if (existingUsers.length > 0) {
      // Update password hash instead of deleting
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        'UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
        [hashedPassword, 'admin@football.com']
      );
      console.log('✅ Admin user password reset successfully');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const [result] = await connection.execute(
        'INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)',
        ['admin@football.com', hashedPassword, 'Admin User']
      );
      console.log('✅ Admin user created successfully');
      console.log('User ID:', result.insertId);
    }

    console.log('Email: admin@football.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('❌ Error resetting admin:', error.message);
  } finally {
    await connection.release();
    await pool.end();
  }
}

resetAdmin();
