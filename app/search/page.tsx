"use client"; // חובה להוסיף את השורה הזו

import React, { useState } from 'react';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState({ city: '', rooms: '', maxPrice: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Search Page</h1>
      <form className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={searchParams.city}
            onChange={handleChange}
            placeholder="Enter city"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">Number of rooms</label>
          <input
            type="number"
            id="rooms"
            name="rooms"
            value={searchParams.rooms}
            onChange={handleChange}
            placeholder="Enter number of rooms"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={searchParams.maxPrice}
            onChange={handleChange}
            placeholder="Enter max price"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchPage;
