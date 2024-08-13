// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-gold text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className={`text-xl font-bold ${pathname === '/' ? 'font-bold' : ''}`}>
          SCHLOSS
        </Link>
        <div className="space-x-4">
          <Link href="/" className={`hover:text-gray-400 ${pathname === '/' ? 'font-bold' : ''}`}>
            Home
          </Link>
          <Link href="/search" className={`hover:text-gray-400 ${pathname === '/search' ? 'font-bold' : ''}`}>
            Search
          </Link>
          <Link href="/about" className={`hover:text-gray-400 ${pathname === '/about' ? 'font-bold' : ''}`}>
            About
          </Link>
          {/* Add more links as needed */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
