'use client'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';
import StarsCanvas from '../components/StarsBackground';
import { GlobalProvider } from '../app/context/GlobalContext'; // ודא שהנתיב נכון
import { UserProvider } from '../context/UserContext'; // עדכן אם הנתיב לא נכון

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <GlobalProvider>
      <UserProvider>
        <html lang="he">
          <body className="flex flex-col min-h-screen relative">
            <div className="absolute inset-0 z-[-1] pointer-events-none">
              <StarsCanvas />
            </div>
            <Navbar />

            <main className="flex-grow relative z-10">
              {children}
            </main>
            <Footer className="relative z-10" />
          </body>
        </html>
      </UserProvider>
    </GlobalProvider>
  );
};

export default RootLayout;
