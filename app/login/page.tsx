'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext, UserType } from '../context/GlobalContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  // שימוש בקונטקסט הגלובלי
  const { setUser, setUserType } = useGlobalContext();

  const handleLogin = async () => {
    if (password.length < 6) {
      setError('הסיסמא חייבת להיות לפחות 6 תווים');
      return;
    }
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // עדכון ה-state הגלובלי כאן
        setUser(email);
        setUserType(result.userType); // Assuming userType is returned correctly
        router.push(result.userType === 'admin' ? '/admin/dashboard' : '/');
      } else if (response.status === 404) {
        setError('המשתמש לא קיים, אנא הרשמו');
        setIsRegistering(true);
      } else {
        setError(result.message || 'התרחשה שגיאה');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('שגיאה בשרת, נסה שנית מאוחר יותר');
    }
  };
  
  const handleRegister = async () => {
    if (password.length < 6) {
      setError('הסיסמא חייבת להיות לפחות 6 תווים');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Automatically log in after registration
        setUser(email);  // עדכון ה-state הגלובלי כאן
        const result = await response.json();
        setUserType(result.userType as UserType);
        router.push(result.userType === 'admin' ? '/admin/dashboard' : '/');
      } else {
        const result = await response.json();
        setError(result.message || 'התרחשה שגיאה');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('שגיאה בשרת, נסה שנית מאוחר יותר');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-black text-white">
      <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-luxury-gold mb-4">{isRegistering ? 'הרשמה' : 'התחברות למערכת'}</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            isRegistering ? handleRegister() : handleLogin();
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="אימייל"
            className="w-full p-2 mb-4 border border-luxury-gold rounded bg-gray-800 text-white"
            required
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמא"
            className="w-full p-2 mb-6 border border-luxury-gold rounded bg-gray-800 text-white"
            required
            autoComplete="current-password"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-luxury-gold text-dark-black p-2 rounded hover:bg-yellow-600 transition duration-300"
          >
            {isRegistering ? 'הרשמה' : 'התחברות'}
          </button>
        </form>
        {!isRegistering && (
          <p className="mt-4 text-center text-gray-400">
            לא רשום עדיין? <span className="text-luxury-gold cursor-pointer" onClick={() => setIsRegistering(true)}>הרשם</span>
          </p>
        )}
        {isRegistering && (
          <p className="mt-4 text-center text-gray-400">
            כבר יש לך חשבון?{' '}
            <span className="text-luxury-gold cursor-pointer" onClick={() => setIsRegistering(false)}>התחבר</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
