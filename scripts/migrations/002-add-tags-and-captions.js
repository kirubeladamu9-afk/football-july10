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

async function runMigration() {
  const pool = mysql.createPool({
    ...getPoolConfig(),
    charset: 'utf8mb4',
  });

  const connection = await pool.getConnection();
  try {
    console.log('Starting migration: Adding tags and image_caption columns...');

    const alterStatements = [
      `ALTER TABLE blogs ADD COLUMN tags JSON`,
      `ALTER TABLE blogs ADD COLUMN image_caption TEXT`,
    ];

    for (const statement of alterStatements) {
      try {
        await connection.execute(statement);
        console.log(`✅ ${statement}`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`⚠️  Column already exists: ${statement.substring(0, 60)}...`);
        } else {
          throw error;
        }
      }
    }

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

runMigration();
