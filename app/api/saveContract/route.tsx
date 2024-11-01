import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { pdfBytes, fileName, propertyId } = await request.json();

    // מוודא שהנתיב לתיקיית public/contracts נכון
    const filePath = path.join(process.cwd(), 'public', 'contracts', fileName);
    console.log(`Attempting to save file to: ${filePath}`);

    // המרת PDF Bytes ל-Buffer
    const buffer = Buffer.from(pdfBytes, 'base64');

    // שמירת הקובץ בתיקייה
    fs.writeFileSync(filePath, buffer);
    console.log('File saved successfully');

    // כאן תוכל לשמור את ה-propertyId לבסיס הנתונים שלך אם יש צורך

    return NextResponse.json({ message: 'File saved successfully', propertyId });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Error saving file' }, { status: 500 });
  }
}
