import mysql from 'mysql2';

// צור את Pool החיבור
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '315170977',
  database: process.env.DB_NAME || 'RealEstateDB'
});

// ייצא את ה-Pool בפורמט של Promise
export const promisePool = pool.promise();
