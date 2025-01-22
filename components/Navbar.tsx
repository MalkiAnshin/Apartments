// components/Navbar.tsx

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserGreeting from '../components/UserGreeting';
import AdminLinksContent from './AdminLinksContent';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [userID, setUserID] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showAdminLinks, setShowAdminLinks] = useState<boolean>(false);

  useEffect(() => {
    // Retrieve userID from localStorage
    const storedUser = localStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser).userId : null;
    setUserID(userId);
  }, []);

  const isSpecialUser = userID === '322385543';

  // Links for everyone
  const commonLinks = [
    { href: "/", label: "דף הבית" },
    { href: "/login", label: "התחברות" },
    { href: "/contactForm", label: "צור קשר" },
    { href: "/personalManagement", label: "ניהול מודעות" },
    { href: "/about", label: "אודות" },
    { href: "/postProperty", label: "פרסום נכס", special: true },
  ];

  // Links only for the special user with descriptions
  const specialLinks = [
    { href: "/adminInterface/ShowMessages", label: "הצג הודעות", description: "צפה בהודעות שנשלחו למנהל." },
    { href: "/adminInterface/ShowSoldProperties", label: "ניהול מודעות מנהל", description: "נהל מודעות שנמכרו." },
    { href: "/adminInterface/ShowUsers", label: "הצגת משתמשים", description: "צפה במשתמשים הרשומים במערכת." },
    { href: "/adminInterface/ShowApartments", label: "הצגת דירות", description: "צפה ברשימת הדירות המפורסמות." },
    { href: "/adminInterface/AddOptionPostForUser", label: "הוספת אפשרות פרסום", description: "הוספת אפשרות פרסום נכס למשתמש ששילם." },

  ];

  return (
    <nav className="bg-luxury-gold text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo and Greeting */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="Logo"
              width={120} 
              height={50} 
              priority
            />
          </Link>
          <UserGreeting />
        </div>

        {/* Hamburger Menu */}
        <button 
          className="block lg:hidden text-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✖' : '☰'}
        </button>

        {/* Links */}
        <div className={`lg:flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 ${isOpen ? 'flex' : 'hidden'} w-full lg:w-auto mt-4 lg:mt-0`}>
          {/* Common links */}
          {commonLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`
                relative inline-block px-6 py-2 text-center 
                rounded-lg 
                bg-opacity-10 transition-all 
                ${pathname === link.href ? 'bg-white text-black font-bold' : 'hover:bg-yellow-50 hover:text-yellow-500'}
                border-2 border-yellow-200
                w-max
              `}
            >
              {link.label}
            </Link>
          ))}

          {/* Special button for admin */}
          {isSpecialUser && (
            <button
              onClick={() => setShowAdminLinks(!showAdminLinks)}
              className={`
                relative inline-block px-6 py-2 text-center 
                rounded-lg 
                bg-opacity-10 transition-all 
                border-2 border-yellow-200
                w-max
                ${showAdminLinks ? 'bg-white text-black font-bold' : 'hover:bg-yellow-50 hover:text-yellow-500'}
              `}
            >
              ניהול כללי
            </button>
          )}
        </div>
      </div>

      {/* Render AdminLinksContent when "ניהול כללי" is clicked */}
      {isSpecialUser && showAdminLinks && <AdminLinksContent specialLinks={specialLinks} pathname={pathname} />}
    </nav>
  );
};

export default Navbar;
