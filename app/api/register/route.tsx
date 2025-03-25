// app/api/register/route.tsx
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid'; // Make sure you have uuid installed

export async function POST(req) {
  const { identityNumber, name, email, password } = await req.json();

  try {
    // Check if the user already exists by identity number or email
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE identity_number = $1 OR email = $2',
      [identityNumber, email]
    );

    if (existingUser.rows.length > 0) {
      const conflictField = existingUser.rows[0].identity_number === identityNumber 
        ? 'תעודת זהות' 
        : 'כתובת אימייל';
      return NextResponse.json({ message: `המשתמש עם ${conflictField} זה כבר קיים` }, { status: 409 });
    }

    // Generate unique user_id
    const userId = uuidv4();

    // Insert the new user into the table
    await pool.query(
      'INSERT INTO users (user_id, username, email, password, identity_number) VALUES ($1, $2, $3, $4, $5)',
      [userId, name, email, password, identityNumber]
    );

    return NextResponse.json(
      {
        message: 'הרשמה הצליחה',
        username: name,
        userType: 'user', // Default userType
        userId: identityNumber, // Return the identity number (or userId)
        remainingListings: 1 // Default value
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'שגיאה בהרשמה' }, // Adjust the error message as needed
      { status: 500 }
    );
  }
}
