import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'malki148B',
  database: process.env.DB_NAME || 'realestatedb',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

export const promisePool = {
  query: async (text: string, params?: any[]): Promise<QueryResult<any>> => {
    return pool.query(text, params);
  },
  end: () => pool.end(),
};
