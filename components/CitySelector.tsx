import React, { useEffect, useState } from 'react';

interface CitySelectorProps {
  onCitySelect: (city: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ onCitySelect }) => {
  const [cities, setCities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = async () => {
    try {
      const response = await fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=d4901968-dad3-4845-a9b0-a57d027f11ab');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.success && data.result?.records) {
        const cityList = data.result.records
          .map((record: any) => record['שם_ישוב'])
          .filter((city: string) => city);
        setCities(cityList);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (err) {
      setError(`Error fetching cities: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
      console.error('Error fetching cities:', err);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setSearchTerm(''); // מנקה את השדה של החיפוש אחרי הבחירה
    onCitySelect(city);
  };

  const filteredCities = cities.filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="mb-4">
      <label htmlFor="city-search" className="block text-lg font-semibold mb-2 text-center">בחר עיר:</label>
      <input
        id="city-search"
        type="text"
        placeholder="...הקלד שם העיר"
        value={searchTerm || selectedCity || ''}
        onChange={e => {
          setSearchTerm(e.target.value);
          setSelectedCity(null); // מאפס את העיר הנבחרת כאשר מתחילים חיפוש חדש
        }}
        className="bg-gray-800 text-white border border-gold rounded-md px-4 py-2 w-full"
      />
      {searchTerm && (
        <ul className="mt-2 bg-gray-800 border border-gold rounded-md max-h-48 overflow-y-auto">
          {filteredCities.map((city, index) => (
            <li
              key={index}
              onClick={() => handleCityClick(city)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-700"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
    </div>
  );
};

export default CitySelector;
