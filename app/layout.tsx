import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';
import StarsCanvas from '@/components/StarsBackground';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen relative">
        {/* StarsCanvas should be a background element */}
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
  );
};

export default RootLayout;
