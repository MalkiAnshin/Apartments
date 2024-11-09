import React, { useState, useEffect } from 'react';

interface FiltersProps {
  onPriceChange: (price: { min: number, max: number }) => void;
  onRoomsChange: (rooms: number) => void;
}

const Filters: React.FC<FiltersProps> = ({ onPriceChange, onRoomsChange }) => {
  const [minPrice, setMinPrice] = useState<string>(''); // הערך התחלתי הוא ריק
  const [maxPrice, setMaxPrice] = useState<string>(''); // הערך התחלתי הוא ריק
  const [rooms, setRooms] = useState<string>(''); // הערך התחלתי הוא ריק

  // עדכון טווח המחירים בזמן אמת
  useEffect(() => {
    if (minPrice && maxPrice) {
      onPriceChange({ min: Number(minPrice), max: Number(maxPrice) });
    }
  }, [minPrice, maxPrice, onPriceChange]);

  // עדכון מספר החדרים בזמן אמת
  useEffect(() => {
    if (rooms) {
      onRoomsChange(Number(rooms));
    }
  }, [rooms, onRoomsChange]);

  return (
    <div className="flex flex-col items-center mb-6 w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <label className="text-lg font-semibold text-center mb-2">טווח מחירים:</label>
        <div className="flex gap-4">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)} // ערך התחלתי ריק
            placeholder="מחיר מינימלי"
            className="bg-gray-800 text-white border border-gold rounded-md px-4 py-2"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)} // ערך התחלתי ריק
            placeholder="מחיר מקסימלי"
            className="bg-gray-800 text-white border border-gold rounded-md px-4 py-2"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-lg font-semibold text-center mb-2">מספר חדרים:</label>
        <input
          type="number"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)} // ערך התחלתי ריק
          placeholder="מספר חדרים"
          className="bg-gray-800 text-white border border-gold rounded-md px-4 py-2 w-full"
        />
      </div>
    </div>
  );
};

export default Filters;
