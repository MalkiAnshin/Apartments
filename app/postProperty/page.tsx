'use client';

import { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useRouter } from 'next/navigation';
import ApartmentForm from '../../components/FormsPostProperty/ApartmentForm';
import ProjectForm from '../../components/FormsPostProperty/ProjectForm';
import LandForm from '../../components/FormsPostProperty/LandForm';
import BusinessForm from '../../components/FormsPostProperty/BusinessForm';

const AddPropertyForm: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>('Apartment');
  const router = useRouter();
  const { user } = useGlobalContext();
  const [canPost, setCanPost] = useState<boolean>(false);

  useEffect(() => {
    const checkUserStatus = () => {
      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (!parsedUser || !parsedUser.userId) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        alert('משתמש לא מחובר, נא לבצע התחברות');
        router.push('/login');
        return;
      }

      // שימו לב לשינוי כאן - בדיקה מדויקת יותר של יתרת הפרסומים
      const remainingListings = parsedUser.remainingListings || 0;
      if (remainingListings <= 0) {
        alert('אין יתרת פרסומים, מעביר לדף תשלום...');
        router.push('/payment');
        return; // הוספת return כאן למנוע המשך ביצוע
      }

      setCanPost(true);
    };

    checkUserStatus();
  }, [router]);
  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
  };

  const renderForm = () => {
    switch (propertyType) {
      case 'Apartment':
        return <ApartmentForm />;
      case 'Project':
        return <ProjectForm />;
      case 'Land':
        return <LandForm />;
      case 'Business':
        return <BusinessForm />;
      default:
        return <ApartmentForm />;
    }
  };

  if (!canPost) return null; // או Spinner אם תרצי

  return (
    <div dir="rtl" className="bg-black bg-opacity-30 text-white p-8 rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gold-300">פרסום נכס</h2>

      {/* סוג נכס */}
      <div>
        <label htmlFor="propertyType" className="block text-sm font-medium mb-2 text-gold-300">סוג נכס</label>
        <select
          id="propertyType"
          value={propertyType}
          onChange={handlePropertyTypeChange}
          className="bg-black bg-opacity-70 text-white p-3 rounded-md w-full focus:outline-none focus:ring focus:ring-gold-300"
        >
          <option value="Apartment">דירה</option>
          <option value="Project">פרויקט קבלן</option>
          <option value="Land">קרקע</option>
          <option value="Business">בית עסק</option>
        </select>
      </div>

      {/* הצגת הטופס המתאים */}
      {renderForm()}
    </div>
  );
};

export default AddPropertyForm;
