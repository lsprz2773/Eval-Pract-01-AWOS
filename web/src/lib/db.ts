import { Pool } from 'pg';

// conexion a bd
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query ejecutada', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Error en la BD', error);
    throw error;
  }
}

export async function getClient() {
  return pool.connect();
}

export default pool;
