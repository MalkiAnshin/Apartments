import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pdf = formData.get('pdf') as File;
    const image = formData.get('image') as File;
    const userId = formData.get('userId');
    const propertyType = formData.get('property_type');
    const signedDate = formData.get('signed_date');
    const propertyId = formData.get('property_id');
    const notes = formData.get('notes');

    // בדיקת שדות חובה
    if (!pdf || !userId || !propertyType || !signedDate || !propertyId || !notes || !image) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // הוספת רשומה למסד הנתונים
    const result = await pool.query(
      'INSERT INTO contracts (user_id, property_type, file_name, signed_date, property_id, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING contract_id',
      [userId, propertyType, 'contract.pdf', signedDate, propertyId, notes]
    );

    const contractId = result.rows[0].contract_id;

    // יצירת תיקייה לשמירת הקבצים
    const directory = path.join(`public/contracts/${propertyType}`, `${contractId}`);
    const pdfPath = path.join(directory, 'contract.pdf');
    const imagePath = path.join(directory, 'id_image.png');

    fs.mkdirSync(directory, { recursive: true });

    // שמירת ה-PDF
    const pdfBuffer = Buffer.from(await pdf.arrayBuffer());
    fs.writeFileSync(pdfPath, pdfBuffer);

    // שמירת התמונה
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(imagePath, imageBuffer);

    // תשובה ללקוח
    return NextResponse.json({ success: true, contractId, message: 'Contract and ID image saved successfully' });
  } catch (error) {
    console.error('Error saving contract:', error);
    return NextResponse.json({ success: false, message: 'Error saving contract', error: error.message }, { status: 500 });
  }
}
