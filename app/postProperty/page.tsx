'use client'

import { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useRouter } from 'next/navigation';
import ApartmentForm from '../../components/FormsPostProperty/ApartmentForm';
import ProjectForm from '../../components/FormsPostProperty/ProjectForm';
import LandForm from '../../components/FormsPostProperty/LandForm';
import BusinessForm from '../../components/FormsPostProperty/BusinessForm';

const AddPropertyForm: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>('Apartment');
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { user, userId, firstListingFree, setFirstListingFree } = useGlobalContext();


  // פונקציה לבדיקת אם המשתמש מחובר ולטפל במעבר דפים
  const checkIsUserLogin = () => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const storedUserId = parsedUser ? parsedUser.userId : null;

    // אם המשתמש לא מחובר, הפנה לדף התחברות
    if (!user || !storedUserId) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      alert("משתמש לא מחובר נא לבצע התחברות");
      router.push('/login');
      return;
    }
  }

  const checkFirstListingFree = () => {
    // אם המשתמש ביצע כבר פרסום ו-firstListingFree שווה ל-true, הפנה לדף התשלום
    if (firstListingFree) {
      console.log("משתמש זה ביצע פרסום נכס");
      router.push('/payment');
    }
  }

  useEffect(() => {

    checkIsUserLogin()
    
    if (userId != 322385543) {
      checkFirstListingFree()
    }
  }, []);

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

  return (
    <div dir="rtl" className="bg-black bg-opacity-30 text-white p-8 rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gold-300">פרסום נכס</h2>

      {/* Property Type Selection */}
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

      {/* Render Form based on selected property type */}
      {renderForm()}
    </div>
  );
}

export default AddPropertyForm;
