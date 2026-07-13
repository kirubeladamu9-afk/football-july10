require('dotenv').config({ path: '.env.local' });
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

(async () => {
  const pool = mysql.createPool(getPoolConfig());
  const conn = await pool.getConnection();
  try {
    const result = await conn.execute(
      `SELECT id, title_en, reading_time, LENGTH(body_en) as body_length FROM blogs LIMIT 5`
    );
    const rows = result[0];
    console.log('Blogs in database:');
    rows.forEach(row => {
      console.log(`- ID: ${row.id}, Title: ${row.title_en}, Reading Time: ${row.reading_time}, Body Length: ${row.body_length}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await conn.release();
    await pool.end();
  }
})();
