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
  const { setUser, setUserType, setUserId, setFirstListingFree } = useGlobalContext();

  useEffect(() => {
    // Load user data from local storage
    const userDetails = localStorage.getItem('user');
    if (userDetails) {
      const parsedUser = JSON.parse(userDetails);
      setUser(parsedUser.username);
      setUserType(parsedUser.userType);
      setUserId(parsedUser.userId);
      setFirstListingFree(parsedUser.firstListingFree);
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
        <h1 className="text-3xl font-bold mb-6 text-center">
          מצא את הנכס או הקרקע המושלם המתאים לצרכים שלך
        </h1>
        <PropertyTypeSelector onSelect={setSelectedType} />
        <div className="mt-6">
          {renderComponent()}
        </div>
      </div>

      {/* קרוסלת הדירות האקראיות */}
      <div className="mt-12">
        <RandomApartmentsCarousel />
        <div id="bthn" lang="en"></div>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://bringthemhomenow.net/1.1.0/hostages-ticker.js";
                script.setAttribute("integrity", "sha384-DHuakkmS4DXvIW79Ttuqjvl95NepBRwfVGx6bmqBJVVwqsosq8hROrydHItKdsne");
                script.setAttribute("crossorigin", "anonymous");
                document.getElementsByTagName("head")[0].appendChild(script);
              })();
            `,
          }}
        />
      </div>
    </GlobalProvider>
  );
};

export default HomePage;
