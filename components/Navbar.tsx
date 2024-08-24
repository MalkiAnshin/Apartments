// components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-luxury-gold text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className={`text-xl font-bold ${pathname === '/' ? 'font-bold' : ''}`}>
          <Image 
            src="/logo.png" // replace with your logo file name
            alt="Logo"
            width={120} // increased width
            height={50} // increased height
          />
        </Link>
        <div className="space-x-4">
          <Link href="/" className={`hover:text-zinc-950 ${pathname === '/' ? 'font-bold' : ''}`}>
            Home
          </Link>
          <Link href="/login" className={`hover:text-zinc-950 ${pathname === '/login' ? 'font-bold' : ''}`}>
            Login
          </Link>
          <Link href="/about" className={`hover:text-zinc-950 ${pathname === '/about' ? 'font-bold' : ''}`}>
            About
          </Link>
          {/* Add more links as needed */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
