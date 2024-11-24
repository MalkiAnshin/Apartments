import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // במקרה שאתה משתמש ב-PostgreSQL

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const city = decodeURIComponent(url.searchParams.get('city')?.trim() || ''); // Decode the city parameter
    console.log('Received city from request:', city); // Log the city name

    let query = 'SELECT * FROM apartments';
    const queryParams: string[] = [];
    
    if (city) {
      query += ` WHERE city ILIKE $1`; // Use ILIKE for case-insensitive matching
      queryParams.push(city);
    }
    
    console.log('Executing query:', query); // Log the query for debugging

    const results = await pool.query(query, queryParams);

    return NextResponse.json(results.rows);
  } catch (error) {
    console.error('Error fetching apartments:', error);
    return NextResponse.error();
  }
}
