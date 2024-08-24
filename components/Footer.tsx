// components/Footer.tsx
import React from 'react';

interface FooterProps {
  className?: string; // הגדרת פרופס className
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`bg-luxury-gold text-white py-4 mt-auto ${className}`}>
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Malki Anshin Digital</p>
        <div className="space-x-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-950">❤️ בניית אתרים במגע אישי ומקצועי</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
