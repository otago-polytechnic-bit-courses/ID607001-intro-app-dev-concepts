import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const connectDatabase = async () => {
  const client = await pool.connect();
  await client.query("SELECT NOW()");
  client.release();
  return pool;
}

export const checkDatabaseHealth = async () => {
  try {
    await pool.query("SELECT 1");
    return { connected: true };
  } catch (err) {
    return { connected: false };
  }
}

export default pool;
