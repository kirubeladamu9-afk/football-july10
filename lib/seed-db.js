const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306,
  });

  try {
    // Check if admin user already exists
    const [users] = await connection.execute(
      'SELECT id FROM admin_users WHERE email = ?',
      ['admin@football.et']
    );

    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        'INSERT INTO admin_users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
        ['admin@football.et', hashedPassword, 'Admin User', 'admin']
      );
      console.log('Admin user created');
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
