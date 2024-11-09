import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // Update the path to your db.ts file

export async function GET(request: Request) {
  const url = new URL(request.url);
  const city = url.searchParams.get('city');

  try {
    const client = await pool.connect();

    // Query businesses based on city if provided
    const query = city ? 'SELECT * FROM business WHERE city = $1' : 'SELECT * FROM business';
    const params = city ? [city] : [];

    const { rows } = await client.query(query, params);
    client.release();

    // Return the result as JSON
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching businesses:', error); // Log the error for debugging
    return NextResponse.json({
      error: 'Error fetching businesses',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
