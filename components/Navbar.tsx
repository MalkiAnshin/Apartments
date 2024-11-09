'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserGreeting from '../components/UserGreeting';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Retrieve user role from localStorage
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
  }, []);

  return (
    <nav className="bg-luxury-gold text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold">
            <Image 
              src="/logo.png" 
              alt="Logo"
              width={120} 
              height={50} 
              priority
            />
          </Link>
          <UserGreeting /> {/* מיקום של UserGreeting בצד שמאל של הלוגו */}
        </div>
        <button 
          className="block lg:hidden text-2xl" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✖' : '☰'}
        </button>
        <div className={`flex flex-col lg:flex-row lg:items-center ${isOpen ? 'block' : 'hidden'} lg:flex lg:space-x-6`}>
          <Link href="/" className={`hover:text-zinc-950 ${pathname === '/' ? 'font-bold' : ''}`}>
            דף הבית
          </Link>
          <Link href="/login" className={`hover:text-zinc-950 ${pathname === '/login' ? 'font-bold' : ''}`}>
            התחברות
          </Link>
          <Link href="/about" className={`hover:text-zinc-950 ${pathname === '/about' ? 'font-bold' : ''}`}>
            אודות
          </Link>
          <Link href="/adminInterface/ShowUsers" className={`hover:text-zinc-950 ${pathname === '/adminInterface/ShowUsers' ? 'font-bold' : ''}`}>
            הצגת משתמשים
          </Link>
          <Link href="/adminInterface/ShowApartments" className={`hover:text-zinc-950 ${pathname === '/adminInterface/ShowApartments' ? 'font-bold' : ''}`}>
             הצגת דירות
          </Link>

          <Link 
            href="/postProperty" 
            className={`
              bg-black text-luxury-gold 
              border-2 border-white rounded-lg px-6 py-3 
              font-bold shadow-lg transition duration-300
              ${pathname === '/postProperty' ? 'bg-white text-black' : 'hover:bg-gray-800 hover:text-yellow-400'}
            `}
          >
            פרסום נכס
          </Link>

          {role === 'admin' && (
            <>
              <Link href="/admin/dashboard" className={`hover:text-zinc-950 ${pathname === '/admin/dashboard' ? 'font-bold' : ''}`}>
                לוח בקרה למנהל
              </Link>
              <Link href="/admin/users" className={`hover:text-zinc-950 ${pathname === '/admin/users' ? 'font-bold' : ''}`}>
                ניהול משתמשים
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
