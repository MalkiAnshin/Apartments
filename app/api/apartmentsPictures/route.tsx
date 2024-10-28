import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import path from 'path';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    // בדוק אם ה-ID קיים
    if (!id) {
      return NextResponse.json({ error: 'ID parameter is missing' }, { status: 400 });
    }

    console.log('Preparing to query for ID:', id);

    // בצע שאילתה למסד הנתונים
    const result = await pool.query(
      'SELECT image_paths FROM apartments WHERE property_id = $1',
      [id]
    );

    console.log('Query executed successfully. Result:', result.rows);

    // בדוק אם יש תוצאות מהשאילתה
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No images found for the given ID' }, { status: 404 });
    }

    // בדוק אם ה-image_paths קיים
    const imagePaths = result.rows[0].image_paths;
    if (!imagePaths || imagePaths.length === 0) {
      return NextResponse.json({ error: 'No image paths available for the given ID' }, { status: 404 });
    }

    console.log('Image paths retrieved:', imagePaths);

    // בניית הנתיבים של התמונות בהתאם למספר הדירה
    const images = imagePaths.map((imageName: string) => {
      return path.join(`/PICTURES/apartments/${id}`, imageName); // בנה את הנתיב
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
