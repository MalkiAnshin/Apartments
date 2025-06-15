import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const id = request.headers.get('property_id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is missing in headers' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT image_paths FROM apartments WHERE property_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No images found for the given ID' }, { status: 404 });
    }

    const imagePaths = result.rows[0].image_paths;
    if (!imagePaths || imagePaths.length === 0) {
      return NextResponse.json({ error: 'No image paths available for the given ID' }, { status: 404 });
    }

    const images = imagePaths.map((imageName: string) => {
      return `/pictures/Apartment/${id}/${imageName}`;
    });

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
