// components/Footer.tsx
const Footer: React.FC = () => {
    return (
      <footer className="bg-gold text-white py-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} SCHLOSS - Real Estate</p>
          <div className="space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">Twitter</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">Instagram</a>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  