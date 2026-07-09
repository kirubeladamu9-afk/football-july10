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

async function migrate() {
  const pool = mysql.createPool({
    ...getPoolConfig(),
    charset: 'utf8mb4',
  });

  const connection = await pool.getConnection();
  try {
    console.log('Starting migration...');

    // Add new columns to blogs table
    const columnsToAdd = [
      { name: 'cover_image', type: 'LONGTEXT' },
      { name: 'author_name', type: 'VARCHAR(255)' },
      { name: 'author_avatar', type: 'LONGTEXT' },
      { name: 'author_role_en', type: 'VARCHAR(255)' },
      { name: 'author_role_am', type: 'VARCHAR(255)' },
      { name: 'gallery', type: 'JSON' },
      { name: 'pull_quote_en', type: 'TEXT' },
      { name: 'pull_quote_am', type: 'TEXT' },
      { name: 'pull_quote_attribution', type: 'VARCHAR(255)' },
      { name: 'previous_post_slug', type: 'VARCHAR(255)' },
      { name: 'next_post_slug', type: 'VARCHAR(255)' },
    ];

    for (const column of columnsToAdd) {
      try {
        await connection.execute(
          `ALTER TABLE blogs ADD COLUMN ${column.name} ${column.type}`
        );
        console.log(`✅ Added column: ${column.name}`);
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`⚠️  Column ${column.name} already exists, skipping`);
        } else {
          throw error;
        }
      }
    }

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    await connection.release();
    await pool.end();
  }
}

migrate();
