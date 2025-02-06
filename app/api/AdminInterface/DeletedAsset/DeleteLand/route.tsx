import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db'; // מסד הנתונים שלך

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const propertyId = url.searchParams.get('property_id'); // מזהה הדירה למחיקה

    if (!propertyId) {
      return NextResponse.json({ error: 'Missing property_id' }, { status: 400 });
    }

    // מחיקת הדירה מהמסד
    const result = await pool.query('DELETE FROM lands WHERE property_id = $1', [propertyId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Apartment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Apartment deleted successfully' });
  } catch (error) {
    console.error('Error deleting apartment:', error);
    return NextResponse.error();
  }
}
