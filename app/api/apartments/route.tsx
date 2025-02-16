import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const city = url.searchParams.get('city')?.trim();
  const rooms = url.searchParams.get('rooms')?.trim();
  const type = url.searchParams.get('type')?.trim();
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');

  try {
    const client = await pool.connect();
    console.log('Database client connected');

    // Create basic query and parameter array
    let query = 'SELECT * FROM apartments WHERE 1=1';
    const params: (string | number)[] = [];

    // Add filters based on provided parameters
    if (city) {
      params.push(city);
      query += ` AND city = $${params.length}`;
    }

    if (rooms) {
      params.push(rooms);
      query += ` AND rooms = $${params.length}`;
    }

    if (type) {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }

    if (minPrice) {
      params.push(Number(minPrice));
      query += ` AND price >= $${params.length}`;
    }

    if (maxPrice) {
      params.push(Number(maxPrice));
      query += ` AND price <= $${params.length}`;
    }


    const { rows } = await client.query(query, params);
    client.release();


    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching apartments:', error);
    return NextResponse.json(
      {
        error: 'Error fetching apartments',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
