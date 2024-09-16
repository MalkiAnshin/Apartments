import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promisePool } from '../../../lib/db'; // עדכן את הנתיב לקובץ db.ts שלך

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const propertyId = formData.get('propertyId') as string;
    const signature = formData.get('signature') as string;
    const name = formData.get('name') as string;
    const date = formData.get('date') as string;
    const comments = formData.get('comments') as string;
    const idCardImage = formData.get('idCardImage') as File | null;

    // טיפול בנתוני הטופס, לדוגמה, שמירה בבסיס הנתונים
    // לדוגמה:
    await prisma.contract.create({
      data: {
        propertyId,
        signature,
        name,
        date,
        comments,
        idCardImage: idCardImage ? idCardImage.toString() : null,
      },
    });

    return NextResponse.json({ message: 'החוזה נחתם בהצלחה!' });
  } catch (error) {
    console.error('שגיאה בטיפול בהגשת החוזה:', error);
    return NextResponse.json({ error: 'נכשל לחתום על החוזה' }, { status: 500 });
  }
}
