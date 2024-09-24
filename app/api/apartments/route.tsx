import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // עדכן את הנתיב לקובץ db.ts שלך

export async function GET(request: Request) {
  const url = new URL(request.url);
  const city = url.searchParams.get('city');

  try {
    const client = await pool.connect();

    // אם יש פרמטר עיר, מחפשים דירות בעיר הזו
    const query = city ? 'SELECT * FROM apartments WHERE city = $1' : 'SELECT * FROM apartments';
    const params = city ? [city] : [];


    const { rows } = await client.query(query, params);
    client.release();


    // // הוספת לוגים של מספרים בסדר עולה
    // const apartmentIds = rows.map((apartment, index) => {
    //   console.log(`Apartment ${index + 1}:`, apartment.property_id); // לוג של מזהי הדירות
    //   return apartment.id;
    // });


    return NextResponse.json(rows); // החזרת התוצאה
  } catch (error) {
    console.error('Error fetching apartments:', error); // לוג של שגיאות
    return NextResponse.json({
      error: 'Error fetching apartments',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
