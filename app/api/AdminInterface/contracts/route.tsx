import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // Assuming you use PostgreSQL

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const propertyId = url.searchParams.get('property_id'); // Get property_id from the query params

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const query = 'SELECT * FROM contracts WHERE property_id = $1';
    const results = await pool.query(query, [propertyId]);

    return NextResponse.json(results.rows);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.error();
  }
}
