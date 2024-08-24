import { NextResponse } from 'next/server';
import { promisePool } from '../../../lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get('city');

    let query = 'SELECT * FROM projects';
    const params: any[] = [];

    if (city) {
      query += ' WHERE city = ?';
      params.push(city);
    }

    const [rows] = await promisePool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({
      error: 'Error fetching projects',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
