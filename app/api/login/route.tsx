// app/api/login/route.tsx
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(req) {
  const { identityNumber, password } = await req.json();

  try {
    const userQuery = await pool.query('SELECT * FROM users WHERE identity_number = $1', [identityNumber]); 
    const user = userQuery.rows[0];

    if (!user) {
      return NextResponse.json({ message: 'משתמש לא קיים' }, { status: 404 });
    }

    if (password !== user.password) {
      console.error(`Invalid password for user: ${identityNumber}`);
      return NextResponse.json({ message: 'סיסמה לא תקינה' }, { status: 401 });
    }

    // Return user details including user_id and first_listing_free
    return NextResponse.json({
      message: 'התחברות מוצלחת',
      userType: user.role,
      username: user.username,
      userId: user.identity_number, // Add user ID
      firstListingFree: user.first_listing_free // Add first_listing_free
    }, { status: 200 });
  } catch (error) {
    console.error('שגיאה במהלך ההתחברות:', error);
    return NextResponse.json({ message: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
