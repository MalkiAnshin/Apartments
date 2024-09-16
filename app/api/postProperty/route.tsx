import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'default-secret-key'; // השתמש במפתח הסודי מהסביבה

export async function GET(request: Request) {
  const cookies = request.headers.get('cookie') || '';
  const token = cookies.includes('authToken') ? cookies.split('authToken=')[1] : '';

  try {
    if (token) {
      jwt.verify(token, SECRET_KEY);
      return NextResponse.json({ isAuthenticated: true });
    } else {
      return NextResponse.json({ isAuthenticated: false });
    }
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false });
  }
}
