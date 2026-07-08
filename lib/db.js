import mysql from 'mysql2/promise';

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

const pool = mysql.createPool({
  ...getPoolConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
  charset: 'utf8mb4',
});

export async function query(text, params = []) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(text, params);
    return { rows: Array.isArray(results) ? results : [] };
  } finally {
    connection.release();
  }
}

export async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;
