import { NextResponse } from 'next/server';
import { promisePool } from '../../../lib/db'; // עדכן את הנתיב לקובץ db.ts שלך

interface ListingCountResult {
  listingCount: number;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // הנח שיש לך שיטה לקבלת ה-user_id מהבקשה, כמו מה-token או העוגיה
    const userId = 'user-id'; // החלף את זה עם לוגיקה אמיתית לקבלת user_id

    // כתוב את השאילתא
    const query = 'SELECT COUNT(*) as listingCount FROM apartments WHERE user_id = ?';
    const result = await promisePool.query(query, [userId]) as unknown;

    // עיבוד התוצאות
    const rows = result as ListingCountResult[];
    if (Array.isArray(rows) && rows.length > 0) {
      const listingCount = rows[0].listingCount ?? 0;
      const canPost = listingCount < 1; // ניתן לפרסם רק אם יש פחות מ-1 רישומים

      return NextResponse.json({ canPost });
    } else {
      throw new Error('Unexpected result format');
    }
  } catch (error) {
    console.error('Error checking listings:', error);
    return NextResponse.json({
      error: 'Error checking listings',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
