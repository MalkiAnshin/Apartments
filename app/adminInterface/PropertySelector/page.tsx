'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PropertySelector: React.FC = () => {
  const router = useRouter();
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>(''); // אפשר להתחיל ריק או עם ערך ברירת מחדל

  const handleSelection = () => {
    if (!selectedPropertyType) {
      alert('אנא בחר סוג נכס');
      return;
    }

    // ניתוב לדף המתאים לפי סוג הנכס
    switch (selectedPropertyType) {
      case 'apartments':
        router.push('/adminInterface/ShowAsset/ShowApartments'); 
        break;
      case 'business':
        router.push('/adminInterface/ShowAsset/ShowBusiness'); 
        break;
      case 'lands':
        router.push('/adminInterface/ShowAsset/ShowLands'); 
        break;    
      case 'projects':
        router.push('/adminInterface/ShowAsset/ShowProjects');
        break;
      default:
        // לא צפוי להגיע לכאן
        break;
    }
  };

  return (
    <div className="bg-transparent text-white min-h-screen flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-gold text-center">בחר סוג נכס</h1>

      <select
        value={selectedPropertyType}
        onChange={(e) => setSelectedPropertyType(e.target.value)}
        className="p-3 rounded-lg border-2 border-yellow-400 bg-gray-800 text-white w-64 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
      >
        <option value="">בחר סוג נכס</option> {/* אופציה ריקה */}
        <option value="apartments">דירות</option>
        <option value="business">בתי עסק</option>
        <option value="lands">קרקעות</option>
        <option value="projects">פרוייקטים</option>
      </select>

      <button
        onClick={handleSelection}
        className="mt-4 px-6 py-2 bg-gold text-black rounded hover:bg-yellow-600"
      >
        המשך
      </button>
    </div>
  );
};

export default PropertySelector;
