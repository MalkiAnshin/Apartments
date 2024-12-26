// components/AdminLinksContent.tsx

import Link from 'next/link';

interface AdminLinksContentProps {
  specialLinks: { href: string, label: string, description: string }[];
  pathname: string;
}

const AdminLinksContent: React.FC<AdminLinksContentProps> = ({ specialLinks, pathname }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {specialLinks.map((link, index) => (
        <div key={index} className="bg-black p-8 rounded-lg border border-transparent hover:border-yellow-400 transition-all hover:shadow-lg mb-8">
          <Link
            href={link.href}
            className={`block text-center text-lg font-medium text-yellow-400 mb-2 hover:text-yellow-500`}
          >
            {link.label}
          </Link>
          <p className="text-sm text-gray-400">{link.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminLinksContent;
