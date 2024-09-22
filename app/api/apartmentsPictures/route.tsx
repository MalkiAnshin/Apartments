import { NextResponse } from 'next/server';
import { promisePool } from '../../../lib/db'; // עדכן את הנתיב לקובץ db.ts שלך

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is missing' }, { status: 400 });
    }

    const client = promisePool;

    console.log('Preparing to query for ID:', id);

    try {
      const result = await client.query(
        'SELECT image_paths FROM apartments WHERE property_id = $1',
        [id]
      );

      console.log('Query executed successfully. Result:', result.rows);

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'No images found for the given ID' }, { status: 404 });
      }

      const imagePaths = result.rows[0].image_paths;
      console.log('Image paths retrieved:', imagePaths);

      return NextResponse.json({ images: imagePaths });
    } catch (queryError) {
      console.error('Error executing query:', queryError);
      return NextResponse.json({ error: 'Query Error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
