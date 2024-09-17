import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'dpg-crk7o23qf0us73detqag-a.frankfurt-postgres.render.com',
  user: process.env.DB_USER || 'realestatedb',
  password: process.env.DB_PASSWORD || 'yjiKrIdBfYNnYU3KX17i13eASj5T8HlC',
  database: process.env.DB_NAME || 'realestatedb_s4e1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

export const promisePool = {
  query: async (text: string, params?: any[]): Promise<QueryResult<any>> => {
    return pool.query(text, params);
  },
  end: () => pool.end(),
};
