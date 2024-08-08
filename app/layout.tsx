// app/layout.tsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css'

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

export default RootLayout;
