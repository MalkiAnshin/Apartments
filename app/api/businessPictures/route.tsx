import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import path from 'path';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    // Check if the ID parameter is provided
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is missing' }, { status: 400 });
    }

    console.log('Preparing to query for Business ID:', id);

    // Query the database for the image paths of the business property
    const result = await pool.query(
      'SELECT image_paths FROM business WHERE property_id = $1',
      [id]
    );

    console.log('Query executed successfully. Result:', result.rows);

    // Check if the query returned any results
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No images found for the given ID' }, { status: 404 });
    }

    // Get image paths from the query result
    const imagePaths = result.rows[0].image_paths;
    if (!imagePaths || imagePaths.length === 0) {
      return NextResponse.json({ error: 'No image paths available for the given ID' }, { status: 404 });
    }

    console.log('Image paths retrieved:', imagePaths);

    // Construct image URLs based on the property ID and image names
    const images = imagePaths.map((imageName: string) => {
      return path.join(`/pictures/Business/${id}`, imageName);
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching business images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
