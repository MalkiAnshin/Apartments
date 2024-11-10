import { NextResponse } from 'next/server'
import pool from '../../../lib/db' // השתמש בקובץ חיבור למסד נתונים שלך

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT * FROM apartments ORDER BY random() LIMIT 5;
    `);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching random apartments:', error);
    return NextResponse.json({ error: 'Error fetching random apartments' }, { status: 500 });
  }
}
