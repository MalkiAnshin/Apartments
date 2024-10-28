// app/api/register/route.tsx
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid'; // Make sure you have uuid installed

export async function POST(req) {
  const { identityNumber, name, email, password } = await req.json(); // Add identityNumber here

  try {
    // Check if the user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: 'המשתמש כבר קיים' }, { status: 409 });
    }

    const userId = uuidv4(); // Generate unique user_id

    // Insert the new user into the table
    await pool.query(
      'INSERT INTO users (user_id, username, email, password, identity_number) VALUES ($1, $2, $3, $4, $5)',
      [userId, name, email, password, identityNumber] // Insert identityNumber
    );

    return NextResponse.json({ message: 'הרשמה הצליחה' }, { status: 201 });
  } catch (error) {
    console.error('שגיאה במהלך ההרשמה:', error);
    return NextResponse.json({ message: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
