import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // עדכן את הנתיב לקובץ db.ts שלך

export async function GET(request: Request) {
  const url = new URL(request.url);
  const city = url.searchParams.get('city');

  try {
    const client = await pool.connect();

    // אם יש פרמטר עיר, מחפשים אדמות בעיר הזו
    const query = city ? 'SELECT * FROM lands WHERE city = $1' : 'SELECT * FROM lands';
    const params = city ? [city] : [];

    const { rows } = await client.query(query, params);
    client.release();

    return NextResponse.json(rows); // החזרת התוצאה
  } catch (error) {
    console.error('Error fetching lands:', error); // לוג של שגיאות
    return NextResponse.json({
      error: 'Error fetching lands',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
