import { NextResponse } from 'next/server';
import { promisePool } from '../../../lib/db'; // עדכן את הנתיב לקובץ db.ts שלך

export async function GET(request: Request) {
  try {
    console.log('111111111111. Start GET request'); // לוג לפני תחילת התהליך
    
    const url = new URL(request.url);
    console.log('222222222222. Request URL:', url.toString()); // לוג להדפסת ה-URL
    
    const city = url.searchParams.get('city');
    console.log('3333333333333. City parameter:', city); // לוג להדפסת העיר אם יש

    let query = 'SELECT * FROM apartments';
    const params: any[] = [];

    if (city) {
      query += ' WHERE city = $1';
      params.push(city);
      console.log('444444444444. Updated query with city:', query); // לוג להצגת השאילתה המעודכנת
    } else {
      console.log('55555555555. No city parameter provided'); // לוג אם אין ערך לפרמטר city
    }

    console.log('66666666666. Executing query:', query, 'with params:', params); // לוג להצגת השאילתה לפני הביצוע

    const { rows } = await promisePool.query(query, params);
    console.log('7777777777. Query result:', rows); // לוג להצגת התוצאה שהתקבלה מהשאילתה

    return NextResponse.json(rows); // החזרת התוצאה
  } catch (error) {
    console.error('8888888888888. Error fetching apartments:', error); // לוג לשגיאה שהתקבלה
    return NextResponse.json({
      error: 'Error fetching apartments',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
