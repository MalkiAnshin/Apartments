'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ApartmentsList from '../components/ApartmentsList';
import PropertyTypeSelector from '../components/PropertyTypeSelector';
import LandList from '../components/LandList';
import BusinessList from '../components/BusinessList';
import ProjectsList from '../components/ProjectsList';
import { GlobalProvider, useGlobalContext } from '../app/context/GlobalContext';
import RandomApartmentsCarousel from '../components/random-apartments';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Global context hook
  const { setUser, setUserType, setUserId, setRemainingListings } = useGlobalContext();

  useEffect(() => {
    // Load user data from local storage
    const userDetails = localStorage.getItem('user');
    if (userDetails) {
      const parsedUser = JSON.parse(userDetails);
      setUser(parsedUser.username);
      setUserType(parsedUser.userType);
      setUserId(parsedUser.userId);
      setRemainingListings(parsedUser.remainingListings);
    }
  }, []);

  const renderComponent = () => {
    if (!selectedType) return null; // Do not render anything if no type is selected

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
        return null; // Render nothing if the type is unknown
    }
  };

  return (
    <GlobalProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 bg-black/10 text-gold text-center">
          תמצא את הנכס או הקרקע המושלם המתאים לצרכים שלך
        </h1>
        <PropertyTypeSelector onSelect={setSelectedType} />
        <div className="mt-6">
          {renderComponent()}

        </div>
        <div>
        </div>
      </div>

      {/* קרוסלת הדירות האקראיות */}
      <div className="mt-12">
        <RandomApartmentsCarousel />
      </div>
      <div className="mt-10 text-xs text-gray-400 text-center leading-relaxed max-w-2xl mx-auto">
        <div className="font-bold mb-2">חיפשת דירה, קרקע או עסק?</div>
        <span>
          פרסום נכס דירה בחינם • חיפוש דירה בזול ללא מתווכים • דירה למכירה בטבריה, ירושלים, תל אביב, בני ברק, רמת גן<br />
          דירה לקנייה בצפון עד 500 אלף שקל • דירה לקניה במרכז • המרכז לחיפוש דירות • אתר עולמי לחיפוש נכס<br />
          דירות נופש • דירה חדשה מקבלן • פרויקטים בנייה • שטחים לבניה • בתים ובניינים • מגרשים למכירה • עסק למכירה<br />
          schloss • שכלוס • אתר נדלן עולמי
        </span>
      </div>

    </GlobalProvider>
  );
};

export default HomePage;
