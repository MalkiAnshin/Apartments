// app/api/login/route.tsx
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(req) {
  const { identityNumber, password } = await req.json(); // שינוי ל-identityNumber

  try {
    // שאילתא למסד הנתונים לחיפוש המשתמש על פי מספר הזהות
    const userQuery = await pool.query('SELECT * FROM users WHERE identity_number = $1', [identityNumber]); 
    const user = userQuery.rows[0];

    if (!user) {
      return NextResponse.json({ message: 'משתמש לא קיים' }, { status: 404 });
    }

    // השוואת הסיסמה
    if (password !== user.password) {
      console.error(`Invalid password for user: ${identityNumber}`);
      return NextResponse.json({ message: 'סיסמה לא תקינה' }, { status: 401 });
    }

    // החזרת שם המשתמש וסוג המשתמש
    return NextResponse.json({ message: 'התחברות מוצלחת', userType: user.role, username: user.username }, { status: 200 });
  } catch (error) {
    console.error('שגיאה במהלך ההתחברות:', error);
    return NextResponse.json({ message: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
