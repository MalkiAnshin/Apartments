import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import path from 'path';

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const id = request.headers.get('property_id');
    console.log('Received GET request for project images. property_id:', id);

    if (!id) {
      console.warn('No property_id provided in headers');
      return NextResponse.json({ error: 'ID parameter is missing in headers' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT image_paths FROM projects WHERE property_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      console.warn('No images found for the given ID:', id);
      return NextResponse.json({ error: 'No images found for the given ID' }, { status: 404 });
    }

    const imagePaths = result.rows[0].image_paths;
    if (!imagePaths || imagePaths.length === 0) {
      console.warn('No image paths available for the given ID:', id);
      return NextResponse.json({ error: 'No image paths available for the given ID' }, { status: 404 });
    }

    const images = imagePaths.map((imageName: string) => {
      const fullPath = path.join(`/pictures/Project/${id}`, imageName);
      console.log('Resolved image path:', fullPath);
      return fullPath;
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching projects images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
