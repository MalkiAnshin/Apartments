import { NextResponse, NextRequest } from 'next/server';
import pool from '../../../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { identityNumber: string } }) {
  const { identityNumber } = params; // ניגש ישירות ל-params

  console.log(`Received GET request for identityNumber: ${identityNumber}`); // לוג קבלת הבקשה עם מזהה הזהות

  try {
    const userQuery = `SELECT * FROM USERS WHERE identity_number = $1`;
    console.log(`Executing query: ${userQuery} with parameters: [${identityNumber}]`); // לוג השאילתא שנשלחת למסד נתונים

    const user = await pool.query(userQuery, [identityNumber]); // השתמש ב-pool.query במקום pool()

    if (user.rows.length === 0) {
      console.log(`No user found with identity number: ${identityNumber}`); // לוג במקרה שאין תוצאה
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
    }

    console.log(`User found: ${user.rows[0].username}, identity number: ${identityNumber}`); // לוג אם נמצא משתמש
    return NextResponse.json({
      name: user.rows[0].username,
      identityNumber: user.rows[0].identity_number,
    });
  } catch (err) {
    console.error('Error during GET request:', err); // לוג במקרה של שגיאה בשרת
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { identityNumber: string } }) {
  const { identityNumber } = params; // ניגש ישירות ל-params

  console.log("Received PATCH request for identityNumber:", identityNumber); // לוג קבלת הבקשה עם מזהה הזהות

  try {
    const updateQuery = `UPDATE USERS SET first_listing_free = FALSE WHERE identity_number = $1`;
    console.log("Executing UPDATE query:", updateQuery, "with identityNumber:", identityNumber); // לוג של השאילתא לעדכון

    const result = await pool.query(updateQuery, [identityNumber]); // השתמש ב-pool.query במקום pool()

    if (result.rowCount === 0) {
      console.log(`Failed to update user for identityNumber: ${identityNumber}. No rows affected.`); // לוג אם לא עדכנו שום משתמש
      return NextResponse.json({ error: 'לא ניתן לעדכן את המשתמש' }, { status: 400 });
    }

    console.log(`User updated successfully for identityNumber: ${identityNumber}. Rows affected: ${result.rowCount}`); // לוג אם העדכון הצליח
    return NextResponse.json({ message: 'הערך שונה בהצלחה' });
  } catch (err) {
    console.error("Error during PATCH request:", err); // לוג במקרה של שגיאה בשרת
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}
