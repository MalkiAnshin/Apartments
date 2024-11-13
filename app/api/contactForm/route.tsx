// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const { userId, username, email, message } = await request.json();

    if (!userId || !username || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO contactMessages (user_id, username, email, message_body) VALUES ($1, $2, $3, $4)',
      [userId, username, email, message]
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error inserting contact message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
