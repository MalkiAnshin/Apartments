"use client"; 

import React, { useState, useEffect } from 'react';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState({ city: '', rooms: '', maxPrice: '' });
  const [cities, setCities] = useState<string[]>([]); // רשימה של ערים
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // קריאה ל-API לקבלת רשימת ערים
    const fetchCities = async () => {
      const resource_id = 'd4901968-dad3-4845-a9b0-a57d027f11ab'; // ה-resource id שלך

      try {
        const response = await fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=${resource_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data from API:', data); // הדפס את הנתונים ל-console כדי לבדוק את המבנה

        // עיבוד הנתונים ממבנה JSON
        if (data.success && data.result && data.result.records) {
          const cityList = data.result.records.map((record: any) => record['שם_ישוב']);
          console.log('City List:', cityList); // הדפס את רשימת הערים
          setCities(cityList);
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (error) {
        setError('Failed to fetch cities.');
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6 text-white">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
      <h1 className="text-4xl font-bold mb-6 text-white">Search Page</h1>
      <form className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium text-gray-300">City</label>
          <select
            id="city"
            name="city"
            value={searchParams.city}
            onChange={handleSelectChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>Select a city</option>
            {cities.length > 0 ? (
              cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))
            ) : (
              <option value="">No cities available</option>
            )}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="rooms" className="block text-sm font-medium text-gray-300">Number of rooms</label>
          <input
            type="number"
            id="rooms"
            name="rooms"
            value={searchParams.rooms}
            onChange={handleInputChange}
            placeholder="Enter number of rooms"
            min="0" // ערך מינימלי
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-300">Max price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={searchParams.maxPrice}
            onChange={handleInputChange}
            placeholder="Enter max price"
            min="0" // ערך מינימלי
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchPage;
