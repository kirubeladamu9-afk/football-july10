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
    console.log('Starting migration: Adding missing blog table columns...');

    // Add missing columns to blogs table
    const alterStatements = [
      `ALTER TABLE blogs ADD COLUMN cover_image LONGTEXT`,
      `ALTER TABLE blogs ADD COLUMN author_name VARCHAR(255)`,
      `ALTER TABLE blogs ADD COLUMN author_avatar LONGTEXT`,
      `ALTER TABLE blogs ADD COLUMN author_role_en VARCHAR(255)`,
      `ALTER TABLE blogs ADD COLUMN author_role_am VARCHAR(255)`,
      `ALTER TABLE blogs ADD COLUMN gallery JSON`,
      `ALTER TABLE blogs ADD COLUMN pull_quote_en TEXT`,
      `ALTER TABLE blogs ADD COLUMN pull_quote_am TEXT`,
      `ALTER TABLE blogs ADD COLUMN pull_quote_attribution VARCHAR(255)`,
      `ALTER TABLE blogs ADD COLUMN previous_post_slug VARCHAR(255)`,
      `ALTER TABLE blogs ADD COLUMN next_post_slug VARCHAR(255)`,
      `ALTER TABLE blogs ADD COLUMN created_by INT`,
      `ALTER TABLE blogs ADD CONSTRAINT fk_blogs_created_by FOREIGN KEY (created_by) REFERENCES admin_users(id)`,
    ];

    for (const statement of alterStatements) {
      try {
        await connection.execute(statement);
        console.log(`✅ ${statement.substring(0, 60)}...`);
      } catch (error) {
        // If column already exists or constraint already exists, continue
        if (error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_DUP_KEYNAME') {
          console.log(`⚠️  Column/Constraint already exists: ${statement.substring(0, 60)}...`);
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
