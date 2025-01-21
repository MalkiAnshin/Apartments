import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    console.log('GET request received'); // לוג להתחלת בקשה GET

    const url = new URL(request.url);
    console.log('Request URL:', url); // הדפסת ה-URL של הבקשה

    const propertyId = url.searchParams.get('property_id'); // Get property_id from the query params
    console.log('Extracted Property ID:', propertyId); // הדפסת מזהה הנכס מתוך ה-query params

    if (!propertyId) {
      console.log('Property ID is missing'); // הדפסת הודעה אם המזהה לא נמצא
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const query = 'SELECT * FROM contracts WHERE property_id = $1';
    console.log('Executing query:', query); // הדפסת השאילתא לפני הריצה

    const results = await pool.query(query, [propertyId]);
    console.log('Query Results:', results); // הדפסת התוצאה של השאילתא

    if (results.rows.length === 0) {
      console.log('No contracts found for property_id:', propertyId); // אם לא נמצאו תוצאות, נדפיס זאת
    }

    return NextResponse.json(results.rows); // מחזירים את התוצאות כתגובה
  } catch (error) {
    console.error('Error fetching contracts:', error); // הדפסת השגיאה במקרה של בעיה בביצוע השאילתא
    return NextResponse.error();
  }
}
