import React, { useState } from 'react';

interface FiltersProps {
  onPriceChange: (price: { min: number; max: number }) => void;
  onRoomsChange: (rooms: number) => void;
}

const Filters: React.FC<FiltersProps> = ({ onPriceChange, onRoomsChange }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(6000000);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMinPrice(value);
    onPriceChange({ min: value, max: maxPrice });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMaxPrice(value);
    onPriceChange({ min: minPrice, max: value });
  };

  const handleRoomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRoomsChange(Number(e.target.value));
  };

  return (
    <div className="filters-container mb-6 bg-transparent rounded-lg shadow-lg p-6 max-w-md mx-auto space-y-6" dir="rtl">
      <div className="filter-item">
        <label className="block text-gold font-semibold mb-2 text-right">טווח מחיר:</label>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="minPrice" className="block text-gold-lighter text-sm mb-1 text-right">מינימום</label>
            <input
              type="number"
              id="minPrice"
              min="0"
              max="6000000"
              step="50000"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="w-full bg-transparent border border-gold rounded-lg py-2 px-3 text-gold focus:outline-none focus:border-gold-light placeholder-gold-lighter"
              placeholder="מינימום"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="maxPrice" className="block text-gold-lighter text-sm mb-1 text-right">מקסימום</label>
            <input
              type="number"
              id="maxPrice"
              min="0"
              max="6000000"
              step="50000"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="w-full bg-transparent border border-gold rounded-lg py-2 px-3 text-gold focus:outline-none focus:border-gold-light placeholder-gold-lighter"
              placeholder="מקסימום"
            />
          </div>
        </div>
      </div>

      <div className="filter-item">
        <label htmlFor="rooms" className="block text-gold font-semibold mb-2 text-right">חדרים:</label>
        <input
          type="number"
          id="rooms"
          min="1"
          onChange={handleRoomsChange}
          className="w-full bg-transparent border border-gold rounded-lg py-2 px-3 text-gold focus:outline-none focus:border-gold-light placeholder-gold-lighter"
          placeholder="בחר מספר חדרים"
        />
      </div>
    </div>
  );
};

export default Filters;
