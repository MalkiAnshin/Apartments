import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // עדכן את הנתיב לקובץ db.ts שלך

export async function GET(request: Request) {
  const url = new URL(request.url);
  const city = url.searchParams.get('city');

  try {
    const client = await pool.connect();

    // אם יש פרמטר עיר, מחפשים עסקים בעיר הזו
    const query = city ? 'SELECT * FROM business WHERE city = $1' : 'SELECT * FROM business';
    const params = city ? [city] : [];

    const { rows } = await client.query(query, params);
    client.release();

    return NextResponse.json(rows); // החזרת התוצאה
  } catch (error) {
    console.error('Error fetching businesses:', error); // לוג של שגיאות
    return NextResponse.json({
      error: 'Error fetching businesses',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
