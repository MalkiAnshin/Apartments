'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', result.token); // שמירה של הטוקן
        localStorage.setItem('userRole', result.userType); // שמירה של סוג המשתמש
        if (result.userType === 'admin') {
          router.push('/admin/dashboard'); // Redirect to admin dashboard
        } else {
          router.push('/'); // Redirect to home page
        }
      } else {
        setError(result.error);
        if (result.error.includes('User does not exist')) {
          router.push('/login'); // Redirect to login page
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-black text-white">
      <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-luxury-gold mb-4">התחברות למערכת</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
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
            התחברות
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
