import React from 'react';

interface FiltersProps {
  onPriceChange: (price: { min: number; max: number }) => void;
  onRoomsChange: (rooms: number) => void;
}

const Filters: React.FC<FiltersProps> = ({ onPriceChange, onRoomsChange }) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onPriceChange({ min: value, max: value + 5000 }); // Example of how the price range can work
  };

  const handleRoomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRoomsChange(Number(e.target.value));
  };

  return (
    <div className="filters-container mb-6">
      <div className="filter-item">
        <label htmlFor="price">מחיר:</label>
        <input
          type="range"
          id="price"
          min="0"
          max="10000"
          step="500"
          onChange={handlePriceChange}
          className="w-full"
        />
      </div>

      <div className="filter-item">
        <label htmlFor="rooms">חדרים:</label>
        <input
          type="number"
          id="rooms"
          min="1"
          onChange={handleRoomsChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default Filters;
