// app/api/login/route.tsx
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userQuery.rows[0];

    if (!user) {
      return NextResponse.json({ message: 'משתמש לא קיים' }, { status: 404 });
    }

    // השווה את הסיסמה בלי הצפנה
    if (password !== user.password) {
      console.error(`Invalid password for user: ${email}`);
      return NextResponse.json({ message: 'סיסמה לא תקינה' }, { status: 401 });
    }

    return NextResponse.json({ message: 'התחברות מוצלחת', userType: user.role }, { status: 200 });
  } catch (error) {
    console.error('שגיאה במהלך ההתחברות:', error);
    return NextResponse.json({ message: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
