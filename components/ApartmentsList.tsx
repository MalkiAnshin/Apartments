import React, { useEffect, useState } from 'react';
import ContractModal from './ContractModal'; // Import the ContractModal component
import ApartmentImages from './ApartmentImages';

const ApartmentList: React.FC = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [apartments, setApartments] = useState<any[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = async () => {
    try {
      const response = await fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=d4901968-dad3-4845-a9b0-a57d027f11ab');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.success && data.result && data.result.records) {
        const cityList: string[] = data.result.records
          .map((record: any) => record['שם_ישוב'])
          .filter((city: string) => city !== '');
        setCities(cityList);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError('Error fetching cities: ' + err.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error('Error fetching cities:', err);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    setFilteredCities(cities.filter((city: string) => city.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [cities]);

  useEffect(() => {
    console.log("use effect selectedCity", selectedCity);
    if (selectedCity) {
      const fetchApartments = async () => {
        try {
          console.log(`Fetching apartments for city: ${selectedCity}`); // לוג לפני קריאת ה-API
          const response = await fetch(`/api/apartments?city=${selectedCity}`);
          console.log(`Response status: ${response.status}`); // לוג סטטוס התגובה      

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Network response was not ok. Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
          }
          const data = await response.json();
          console.log('Fetched apartments:', data); // לוג אחרי קבלת הדירות

          if (Array.isArray(data)) {
            setApartments(data);
            console.log('Updated apartments state:', data); // לוג כאן

          } else {
            throw new Error('Unexpected data format');
          }
        } catch (err) {
          if (err instanceof Error) {
            setError('Error fetching apartments: ' + err.message);
          } else {
            setError('An unknown error occurred');
          }
          console.error('Error fetching apartments:', err);
        }
      };

      fetchApartments();
    }
  }, [selectedCity]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const str = event.target.value.toLowerCase();
    setFilteredCities(cities.filter((city: string) => city.toLowerCase().includes(str)));
  };

  const handleCitySelect = (city: string) => {
    console.log('Selected city before update:', selectedCity); // לוג לפני העדכון
    setSelectedCity(city);
    console.log('Selected city after update:', city); // לוג אחרי העדכון
    setSearchTerm('');
    console.log('Search term after update:', ''); // לוג אחרי עדכון השדה
  };

  const handleApartmentClick = (apartment: any) => {
    setSelectedApartment(apartment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal. Selected apartment:', selectedApartment); // לוג של הדירה שנבחרה לפני סגירה
    setShowModal(false);
    console.log('Modal state after closing:', showModal); // לוג אחרי סגירת המודאל
    setSelectedApartment(null);
  };

  console.log(apartments);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">מצא את הדירה המתאימה</h1>
        {error && <div className="text-red-600 mb-4 text-center">Error: {error}</div>}
        <div className="mb-4">
          <label htmlFor="city-search" className="block text-lg font-semibold mb-2 text-center">בחר עיר:</label>
          <input
            id="city-search"
            type="text"
            placeholder="Type city name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-gray-800 text-white border border-gold rounded-md px-4 py-2 w-full"
          />

          {searchTerm && (
            <ul className="mt-2 bg-gray-800 border border-gold rounded-md">
              {filteredCities.map((city: string, index: number) => (
                <li
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedCity && (
          <h2 className="text-2xl font-semibold mb-4 text-gold text-center">
            דירות ב{selectedCity}
          </h2>
        )}
        {apartments.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apartments.map((apartment, index) => (
              <li
                key={apartment.property_id}
                className="bg-gray-800 p-4 rounded-lg border border-gold cursor-pointer"
              >
                <p className="text-lg font-medium">שכונה/איזור: {apartment.neighborhood}</p>
                <p className="text-md text-gold">מחיר: {apartment.price} ש"ח</p>
                <p className="text-sm">חדרים: {apartment.rooms}</p>
                <div className="flex gap-2">
                  <ApartmentImages property_id={apartment.property_id} />
                </div>
                {/* כפתור לפרטים נוספים */}
                <button
                  className="mt-4 bg-gold text-black px-6 py-2 rounded-md font-semibold"
                  onClick={() => handleApartmentClick(apartment)}
                >
                  לפרטים נוספים
                </button>
              </li>
            ))}
          </ul>
        ) : (
          selectedCity && <p className="text-gray-400 text-center">No apartments found for this city.</p>
        )}

        {showModal && selectedApartment && (
          <ContractModal
            selectedProperty={selectedApartment}
            onClose={handleCloseModal}
          />
        )}
      </div>
          </div>
  );
};

export default ApartmentList;
