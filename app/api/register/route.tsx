// app/api/register/route.tsx
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid'; // ודא שהתקנת את uuid

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // בדוק אם המשתמש כבר קיים
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: 'המשתמש כבר קיים' }, { status: 409 });
    }

    const userId = uuidv4(); // יוצר user_id ייחודי

    // הכנס את המשתמש החדש לטבלה
    await pool.query('INSERT INTO users (user_id, email, password) VALUES ($1, $2, $3)', [userId, email, password]);

    return NextResponse.json({ message: 'הרשמה הצליחה' }, { status: 201 });
  } catch (error) {
    console.error('שגיאה במהלך ההרשמה:', error);
    return NextResponse.json({ message: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
