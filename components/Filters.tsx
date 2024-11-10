import React, { useState, useEffect } from 'react';

interface FiltersProps {
  onFilterChange: (filters: { price: { min: number, max: number }, rooms: number }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState<number>(100);  // Default minimum price is 100
  const [maxPrice, setMaxPrice] = useState<number>(30000000); // Default maximum price is 30 million
  const [rooms, setRooms] = useState<string>(''); // Initial value is empty

  // Update the price range in real-time
  useEffect(() => {
    onFilterChange({
      price: { min: minPrice, max: maxPrice },
      rooms: Number(rooms),
    });
  }, [minPrice, maxPrice, rooms, onFilterChange]);

  return (
    <div className="flex flex-col items-center mb-6 w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <label className="text-lg font-semibold text-center mb-2">טווח מחירים:</label>
        <div className="flex gap-4 items-center">
          <input
            type="range"
            min="100"  // Min price is 100
            max="30000000"  // Max price is 30 million
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="bg-gray-700 text-white"
          />
          <span>{minPrice} - {maxPrice}</span>
          <input
            type="range"
            min="100"  // Min price is 100
            max="30000000"  // Max price is 30 million
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="bg-gray-700 text-white"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-lg font-semibold text-center mb-2">מספר חדרים:</label>
        <input
          type="number"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          placeholder="מספר חדרים"
          className="bg-gray-800 text-white border border-gold rounded-md px-4 py-2 w-full"
        />
      </div>
    </div>
  );
};

export default Filters;
