import { NextResponse } from 'next/server';
import pool from '../../../../../../lib/db'; // נתיב מותאם לקובץ ה-DB

// הגדרת דינמיות אם יש צורך
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);  // קבלת הנתיב של ה-URL
  const parts = pathname.split('/');  // חילוק הנתיב
  const identity_number = parts[parts.length - 2];  // קבלת ה-identity_number מתוך הנתיב

  if (!identity_number) {
    return NextResponse.json(
      { error: 'Missing identity_number' },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    const query = `
      SELECT * FROM apartments WHERE user_id = $1
    `;
    const { rows } = await client.query(query, [identity_number]);
    client.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching apartments:', error);
    return NextResponse.json(
      { error: 'Error fetching apartments', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
