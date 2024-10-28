// app/api/check-auth/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'mySuperSecretKey'; // קח את המפתח הסודי מקובץ .env

export async function GET(request: Request) {
  const cookies = request.headers.get('cookie') || '';
  const token = cookies.split('; ').find(row => row.startsWith('token='))?.split('=')[1]; // שלוף את ה-token

  try {
    if (token) {
      jwt.verify(token, SECRET_KEY);
      return NextResponse.json({ isAuthenticated: true });
    } else {
      return NextResponse.json({ isAuthenticated: false });
    }
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.json({ isAuthenticated: false });
  }
}
