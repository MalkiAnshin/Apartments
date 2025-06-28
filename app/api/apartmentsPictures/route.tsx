import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const id = request.headers.get('property_id');

    if (!id) {
      console.warn('No property_id provided in headers');
      return NextResponse.json({ error: 'ID parameter is missing in headers' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT image_paths FROM apartments WHERE property_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      console.warn('No images found for the given ID:', id);
      return NextResponse.json({ error: 'No images found for the given ID' }, { status: 404 });
    }

    const rawPaths = result.rows[0].image_paths;

    // הטיפול החשוב כאן:
    const imagePaths = Array.isArray(rawPaths)
      ? rawPaths
      : rawPaths.replace(/[{}"]/g, '').split(',');

    if (!imagePaths || imagePaths.length === 0) {
      console.warn('No image paths available for the given ID:', id);
      return NextResponse.json({ error: 'No image paths available for the given ID' }, { status: 404 });
    }

    const images = imagePaths.map((imageName: string) => {
      return `https://www.schloss.co.il/userfiles/pictures/Apartment/${id}/${imageName}`;
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching apartments images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
