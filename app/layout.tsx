'use client';

import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';
import StarsCanvas from '../components/StarsBackground';
import { GlobalProvider } from '../app/context/GlobalContext'; // Ensure the path is correct
import { UserProvider } from '../context/UserContext'; // Update if the path is incorrect
import { useGlobalContext } from '../app/context/GlobalContext'; // Ensure this path is correct

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <GlobalProvider>
      <UserProvider>
        <InnerLayout>{children}</InnerLayout>
      </UserProvider>
    </GlobalProvider>
  );
};

// This component will be inside the GlobalProvider
const InnerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, setUserType } = useGlobalContext();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { username, userType } = JSON.parse(storedUser);
      setUser(username);
      setUserType(userType);
    }
  }, [setUser, setUserType]);

  return (
    <html lang="he">
      <body className="flex flex-col min-h-screen relative">
        <div className="absolute inset-0 z-[-1] pointer-events-none">
          <StarsCanvas />
          {/* Adjusted background image for larger logo */}
          <div
            className="absolute inset-x-0 top-[150px] flex items-center justify-center"
            style={{
              backgroundImage: "url('/logo.png')",
              backgroundSize: 'contain', // Keep the aspect ratio intact
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              opacity: 0.3,        // Increase opacity for better visibility
              minHeight: '330px',  // Much larger minimum height
              maxHeight: '70vh',   // Max height set to a large value (can adjust based on screen size)
            }}
          />
        </div>
        <Navbar />

        <main className="flex-grow relative z-10">
          {children}
        </main>
        <Footer className="relative z-10" />
      </body>
    </html>
  );
};

export default RootLayout;
