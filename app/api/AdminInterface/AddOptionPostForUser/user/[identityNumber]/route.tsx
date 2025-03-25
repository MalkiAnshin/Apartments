import { NextResponse, NextRequest } from 'next/server';
import pool from '../../../../../../lib/db';

export const dynamic = 'force-dynamic';

// פונקציית GET
export async function GET(req: NextRequest, { params }: { params: { identityNumber: string } }) {
  const { identityNumber } = params; // גישה נכונה לפרמטר דרך params

  console.log(`Received GET request for identityNumber: ${identityNumber}`); // לוג קבלת הבקשה עם מזהה הזהות

  try {
    const userQuery = `SELECT * FROM USERS WHERE identity_number = $1`;
    console.log(`Executing query: ${userQuery} with parameters: [${identityNumber}]`); // לוג השאילתא שנשלחת למסד נתונים

    const user = await pool.query(userQuery, [identityNumber]); // השתמש ב-pool.query במקום pool()

    if (user.rows.length === 0) {
      console.log(`No user found with identity number: ${identityNumber}`); // לוג במקרה שאין תוצאה
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
    }

    return NextResponse.json({
      name: user.rows[0].username,
      identityNumber: user.rows[0].identity_number,
    });
  } catch (err) {
    console.error('Error during GET request:', err); // לוג במקרה של שגיאה בשרת
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}

// פונקציית PATCH
export async function PATCH(req: NextRequest, { params }: { params: { identityNumber: string } }) {
  const { identityNumber } = params; // גישה נכונה לפרמטר דרך params
  const { incrementValue } = await req.json(); // קבלת הערך החדש שמגיע מהלקוח (נניח 7)

  console.log("Received PATCH request for identityNumber:", identityNumber); // לוג קבלת הבקשה עם מזהה הזהות
  console.log("Received incrementValue:", incrementValue); // לוג של הערך שמגיע מהלקוח (נניח 7)

  try {
    const updateQuery = `
      UPDATE USERS 
      SET remaining_listings = remaining_listings + $1 
      WHERE identity_number = $2
    `;
    console.log("Executing UPDATE query:", updateQuery, "with identityNumber:", identityNumber, "and incrementValue:", incrementValue);

    const result = await pool.query(updateQuery, [incrementValue, identityNumber]); // חיבור הערך הקיים עם הערך החדש

    if (result.rowCount === 0) {
      console.log(`Failed to update user for identityNumber: ${identityNumber}. No rows affected.`);
      return NextResponse.json({ error: 'לא ניתן לעדכן את המשתמש' }, { status: 400 });
    }

    console.log(`User updated successfully for identityNumber: ${identityNumber}. Rows affected: ${result.rowCount}`);
    return NextResponse.json({ message: 'הערך שונה בהצלחה' });
  } catch (err) {
    console.error("Error during PATCH request:", err);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}
