import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // השתמשי ב-DATABASE_URL
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // port: Number(process.env.DB_PORT),
  connectionTimeoutMillis: 30000, // 30 שניות, לדוגמה
  idleTimeoutMillis: 10000, // זמן המתנה של 10 שניות
  max: 20,

});

export const promisePool = {
  query: async (text: string, params?: any[]): Promise<QueryResult<any>> => {
    try {
      console.log('Executing query:', text, params);
      return await pool.query(text, params);
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  },
  end: async () => {
    try {
      await pool.end();
    } catch (error) {
      console.error('Error closing pool:', error);
      throw error;
    }
  },
};
