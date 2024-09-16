// pages/api/saveContract.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { pdfBytes, fileName } = req.body;

      // מוודא שהנתיב לתיקיית public/contracts נכון
      const filePath = path.join(process.cwd(), 'public', 'contracts', fileName);
      console.log(`Attempting to save file to: ${filePath}`);

      // המרת PDF Bytes ל-Buffer
      const buffer = Buffer.from(pdfBytes, 'base64');

      // שמירת הקובץ בתיקייה
      fs.writeFileSync(filePath, buffer);
      console.log('File saved successfully');

      res.status(200).json({ message: 'File saved successfully' });
    } catch (error) {
      console.error('Error saving file:', error);
      res.status(500).json({ error: 'Error saving file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
