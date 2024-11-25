import { NextResponse } from 'next/server';
import pool from '../../../../../../lib/db'; // נתיב מותאם לקובץ ה-DB

export async function GET(request: Request, { params }: { params: { identity_number: string } }) {
  const { identity_number } = params;

  try {
    const client = await pool.connect();
    const query = `
      SELECT * FROM apartments WHERE user_id = $1
    `;
    const { rows } = await client.query(query, [identity_number]);
    client.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Error fetching contracts', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
