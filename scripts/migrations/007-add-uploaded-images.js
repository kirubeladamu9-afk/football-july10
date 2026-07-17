const mysql = require('mysql2/promise');

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

async function runMigration() {
  const pool = mysql.createPool({
    ...getPoolConfig(),
    charset: 'utf8mb4',
  });

  const connection = await pool.getConnection();
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS uploaded_images (
        id CHAR(36) PRIMARY KEY,
        content_type VARCHAR(100) NOT NULL,
        image_data LONGBLOB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
  } finally {
    await connection.release();
    await pool.end();
  }
}

runMigration();
