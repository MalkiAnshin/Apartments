// components/Footer.tsx
import React from 'react';

interface FooterProps {
  className?: string; // הגדרת פרופס className
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`bg-luxury-gold text-white py-4 mt-auto ${className}`}>
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Malki Anshin</p>
        <div className="space-x-4">
          <a 
            href="mailto:MALKI148148@gmail.com" 
            className="hover:text-zinc-950"
          >
            ❤️ בניית אתרים במגע אישי ומקצועי
            <br />
            malki148148@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
