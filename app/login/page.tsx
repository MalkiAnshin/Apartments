'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext, UserType } from '../context/GlobalContext';

const LoginPage = () => {
  const [identityNumber, setIdentityNumber] = useState(''); // State for identity number
  const [name, setName] = useState(''); // Username state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  // Use global context
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
        body: JSON.stringify({ identityNumber, password }),
      });
  
      const result = await response.json();
      
      // הוסף לוג לראות מה מחזיר ה-API
      console.log('API Response:', result);
    
      if (response.ok) {
        console.log('Login successful:', result.userType);
        setUser(result.username); // ודא ששם השדה הוא נכון
        setUserType(result.userType);
        router.push(result.userType === 'admin' ? '/admin/dashboard' : '/');
      } else {
        console.error('Error during login:', result.message);
        setError(result.message || 'התרחשה שגיאה');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
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
        body: JSON.stringify({ identityNumber, name, email, password }), // Include identityNumber
      });
      

      if (response.ok) {
        const result = await response.json();
        console.log('Registration successful:', name); // Log on successful registration
        setUser(name); // Update global state with username
        setUserType(result.userType as UserType); // Ensure userType is set correctly
        router.push(result.userType === 'admin' ? '/admin/dashboard' : '/');
      } else {
        const result = await response.json();
        console.error('Error during registration:', result.message); // Log error if any
        setError(result.message || 'התרחשה שגיאה');
      }
    } catch (error) {
      console.error('An error occurred during registration:', error); // Log server error
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
          {/* Always show identity number input */}
          <input
            type="text"
            value={identityNumber}
            onChange={(e) => setIdentityNumber(e.target.value)}
            placeholder="מספר זהות"
            className="w-full p-2 mb-4 border border-luxury-gold rounded bg-gray-800 text-white"
            required
            autoComplete="identityNumber"
          />

          {isRegistering && ( // Show name input only during registration
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם"
              className="w-full p-2 mb-4 border border-luxury-gold rounded bg-gray-800 text-white"
              required
              autoComplete="name"
            />
          )}

          {isRegistering && ( // Show email input only during registration
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="אימייל"
              className="w-full p-2 mb-4 border border-luxury-gold rounded bg-gray-800 text-white"
              required
              autoComplete="email"
            />
          )}

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
