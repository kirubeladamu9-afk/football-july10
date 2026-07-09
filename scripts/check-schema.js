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

async function checkSchema() {
  const pool = mysql.createPool(getPoolConfig());
  const connection = await pool.getConnection();
  try {
    const [columns] = await connection.execute('DESCRIBE blogs');
    console.log('Blogs table columns:');
    columns.forEach(c => console.log(`  ${c.Field}`));
    
    // Check for duplicates
    const fieldNames = columns.map(c => c.Field);
    const duplicates = fieldNames.filter((item, index) => fieldNames.indexOf(item) !== index);
    if (duplicates.length > 0) {
      console.log('\n⚠️  Duplicate columns found:');
      duplicates.forEach(d => console.log(`  ${d}`));
    } else {
      console.log('\n✅ No duplicate columns found');
    }
  } finally {
    await connection.release();
    await pool.end();
  }
}

checkSchema();
