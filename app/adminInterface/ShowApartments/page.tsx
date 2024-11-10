'use client';

import React, { useEffect, useState } from 'react';
import Filters from '../../../components/Filters';
import CitySelector from '../../../components/CitySelector'; // Import the CitySelector component

const ShowApartments: React.FC = () => {
  const [apartments, setApartments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null); // Add state for selected city

  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [roomsFilter, setRoomsFilter] = useState<number>(0);

  // Fetch apartments from API
  const fetchApartments = async () => {
    try {
      const trimmedCity = selectedCity?.trim() || ''; // Clean the city name
      const encodedCity = encodeURIComponent(trimmedCity); // Manually encode the city name
      // console.log('Fetching apartments with city:', encodedCity);

      const response = await fetch(`/api/AdminInterface/ShowApartments?city=${encodedCity}`);
      if (!response.ok) {
        throw new Error('Response from server was not OK');
      }
      const data = await response.json();
      // console.log('Apartments fetched:', data);
      setApartments(data);
    } catch (err) {
      setError('Error fetching apartments: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Error fetching apartments:', err);
    }
  };
    
  useEffect(() => {
    // console.log('Component mounted or city changed, fetching apartments...');
    fetchApartments();
  }, [selectedCity]); // Re-run when city changes

  // Filter apartments based on price, rooms, and selected city
  const filteredApartments = apartments.filter((apartment) => {
    const isInPriceRange = apartment.price >= priceFilter.min && apartment.price <= priceFilter.max;
    const isInRoomsRange = roomsFilter ? apartment.rooms === roomsFilter : true;
    const isInCity = selectedCity ? apartment.city === selectedCity : true; // Filter by selected city or show all

    // Log for debugging
    // console.log('Apartment:', apartment.city, isInCity, isInPriceRange, isInRoomsRange);

    return isInPriceRange && isInRoomsRange && isInCity;
  });

  return (
    <div className="bg-transparent text-white min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">רשימת דירות</h1>
        {error && <div className="text-red-600 mb-4 text-center">שגיאה: {error}</div>}

        {/* Filters */}
        <Filters
          onPriceChange={setPriceFilter}
          onRoomsChange={setRoomsFilter}
        />

        {/* City selector */}
        <CitySelector onCitySelect={setSelectedCity} />

        {/* Apartments list */}
        {filteredApartments.length > 0 ? (
          <table className="min-w-full bg-transparent border border-gold mb-6">
            <thead>
              <tr className="border-b border-gold">
                <th className="text-left p-4">מזהה נכס</th>
                <th className="text-left p-4">עיר</th>
                <th className="text-left p-4">מחיר</th>
                <th className="text-left p-4">חדרים</th>
                <th className="text-left p-4">פרטי יצירת קשר</th>
                <th className="text-left p-4">סוג מוכר</th>
                <th className="text-left p-4">פעולה</th>
              </tr>
            </thead>
            <tbody>
              {filteredApartments.map((apartment) => (
                <tr key={apartment.property_id} className="border-b border-gold">
                  <td className="p-4">{apartment.property_id}</td>
                  <td className="p-4">{apartment.city}</td>
                  <td className="p-4">{apartment.price}</td>
                  <td className="p-4">{apartment.rooms}</td>
                  <td className="p-4">{apartment.contact_seller}</td>
                  <td className="p-4">{apartment.seller_type}</td>
                  <td className="p-4">
                    <button
                      className="bg-gold text-black px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      הצג חוזים
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-center">...טוען</p>
        )}
      </div>
    </div>
  );
};

export default ShowApartments;
