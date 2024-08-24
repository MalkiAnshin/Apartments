'use client'
import React, { useState } from 'react';
import ApartmentsList from '../components/ApartmentsList';
import PropertyTypeSelector from '@/components/PropertyTypeSelector';
import LandList from '@/components/LandList';
import BusinessList from '@/components/BusinessList';
import ProjectsList from '@/components/ProjectsList';

const HomePage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');

  const renderComponent = () => {
    switch (selectedType) {
      case 'דירות':
        return <ApartmentsList />;
      case 'בתי עסק':
        return <BusinessList />;
      case 'קרקעות':
        return <LandList />;
      case 'פרויקט קבלן':
        return <ProjectsList />;
      default:
        return <ApartmentsList />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        מצא את הנכס או הקרקע המושלם המתאים לצרכים שלך
      </h1>
      <PropertyTypeSelector onSelect={setSelectedType} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default HomePage;
