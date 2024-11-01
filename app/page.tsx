'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ApartmentsList from '../components/ApartmentsList';
import PropertyTypeSelector from '../components/PropertyTypeSelector';
import LandList from '../components/LandList';
import BusinessList from '../components/BusinessList';
import ProjectsList from '../components/ProjectsList';
import { GlobalProvider, useGlobalContext } from '../app/context/GlobalContext';

const HomePage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('דירות');
  
  // הוק של קונטקסט גלובלי
  const { setUser, setUserType, setUserId, setFirstListingFree } = useGlobalContext();

  useEffect(() => {
    // טען נתוני משתמש מהאחסון המקומי
    const userDetails = localStorage.getItem('user');
    if (userDetails) {
      const parsedUser = JSON.parse(userDetails);
      setUser(parsedUser.username);
      setUserType(parsedUser.userType);
      setUserId(parsedUser.userId);
      setFirstListingFree(parsedUser.firstListingFree);
      
      console.log('User data loaded from localStorage:', parsedUser);
    } else {
      console.log('No user data found in localStorage.');
    }
  }, []); 
  
  const renderComponent = () => {
    switch (selectedType) {
      case 'דירות':
        return <ApartmentsList key="apartments" />;
      case 'בתי עסק':
        return <BusinessList key="business" />;
      case 'קרקעות':
        return <LandList key="land" />;
      case 'פרויקט קבלן':
        return <ProjectsList key="projects" />;
      default:
        return <ApartmentsList key="default-apartments" />;
    }
  };

  return (
    <GlobalProvider>
      <div className="container mx-auto p-4">
        {/* <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={250}
            height={250}
            className="object-contain"
            priority
          />
        </div> */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          מצא את הנכס או הקרקע המושלם המתאים לצרכים שלך
        </h1>
        <PropertyTypeSelector onSelect={setSelectedType} />
        <div className="mt-6">
          {renderComponent()}
        </div>
      </div>
    </GlobalProvider>
  );
};

export default HomePage;
