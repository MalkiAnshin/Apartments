import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // Update the path to your db.ts file

export async function GET(request: Request) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM users'); // Query to select all users
    client.release();

    return NextResponse.json(rows); // Return the users data
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      error: 'Error fetching users',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
