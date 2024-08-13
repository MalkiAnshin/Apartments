// lib/db.js
import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.localhost,
  user: process.env.Malki,
  password: process.env.315170977,
  database: process.env.RealEstateDB
});

export const promisePool = pool.promise();
