import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { promisePool } from '@/lib/db';

const SECRET_KEY = process.env.SECRET_KEY as string; // גישה למפתח הסודי

interface User {
  user_id: string;
  email: string;
  password?: string;
  role: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { email, password }: { email: string; password: string } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // בדוק אם המשתמש קיים
    const [rows] = await promisePool.query<User[]>('SELECT user_id, email, password, role FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      const user = rows[0];

      // החלף עם אימות סיסמה אמיתי אם נדרש
      if (password !== user.password) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      // צור JWT token
      const token = jwt.sign({ userId: user.user_id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

      // הגדר את ה-token בעוגיה
      const headers = new Headers();
      headers.append('Set-Cookie', `authToken=${token}; HttpOnly; Path=/; Max-Age=3600`);

      return NextResponse.json({
        message: 'Login successful',
        token: token,
        userType: user.role
      }, { headers });
    } else {
      // המשתמש לא קיים
      return NextResponse.json({ error: 'User does not exist, please sign in' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
