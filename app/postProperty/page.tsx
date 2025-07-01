'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApartmentForm from '../../components/FormsPostProperty/ApartmentForm';
import ProjectForm from '../../components/FormsPostProperty/ProjectForm';
import LandForm from '../../components/FormsPostProperty/LandForm';
import BusinessForm from '../../components/FormsPostProperty/BusinessForm';

const VIP_ID = 322385543;

const AddPropertyForm: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>('Apartment');
  const [canPost, setCanPost] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkLocalUser = () => {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      const userIdRaw = user?.userId || user?.identity_number;
      const userId = Number(userIdRaw);

      if (!user || !userId) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        alert('משתמש לא מחובר, נא להתחבר');
        router.push('/login');
        return;
      }

      if (userId === VIP_ID) {
        setCanPost(true);
        return;
      }

      const rawRemaining = user?.remainingListings ?? user?.remaining_listings;
      const remaining = Number(rawRemaining);

      if (isNaN(remaining) || remaining <= 0) {
        alert('אין יתרת פרסומים. מעביר לתשלום...');
        router.push('/payment');
        return;
      }

      setCanPost(true);
    };

    checkLocalUser();
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

  if (!canPost) return null;

  return (
    <div dir="rtl" className="bg-black bg-opacity-30 text-white p-8 rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gold-300">פרסום נכס</h2>

      <div>
        <label htmlFor="propertyType" className="block text-sm font-medium mb-2 text-gold-300">
          סוג נכס
        </label>
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

      {renderForm()}
    </div>
  );
};

export default AddPropertyForm;
