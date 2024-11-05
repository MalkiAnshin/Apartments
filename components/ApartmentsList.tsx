import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContractModal from './ContractModal';
import ApartmentImages from './ApartmentImages';

const ApartmentList: React.FC = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [apartments, setApartments] = useState<any[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();



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

  useEffect(() => {
    if (selectedCity) {
      const fetchApartments = async () => {
        try {
          const response = await fetch(`/api/apartments?city=${selectedCity}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Network response was not ok. Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
          }
          const data = await response.json();
          if (Array.isArray(data)) {
            setApartments(data);
          } else {
            throw new Error('Unexpected data format');
          }
        } catch (err) {
          setError(`Error fetching apartments: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
          console.error('Error fetching apartments:', err);
        }
      };

      fetchApartments();
    }
  }, [selectedCity]);


  const checkContract = async (apartmentId: string) => {

    const userId = JSON.parse(localStorage.getItem('user') || '{}').userId || null;
    console.log(userId);
    if (!userId) {
      console.warn('No userId found, redirecting to login');
      router.push('/login'); // הפניה לדף ההתחברות
      return;
    }




    try {
      const response = await fetch(`/api/moreDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apartmentId, userId }), // Ensure both parameters are included
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok. Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      if (data.exists) {
        setShowDetails(true)
        console.log("Contract exists:", data.exists);
      } else {
        setShowDetails(false)
        console.log("No contract found");
      }
    } catch (err) {
      console.error('Error checking contract:', err);
      setError(`Error checking contract: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
  };


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setSearchTerm('');
  };

  const handleApartmentClick = (apartment: any) => {
    checkContract(apartment.property_id);
    setSelectedApartment(apartment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApartment(null);
  };

  const filteredCities = cities.filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="text-white min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">מצא את הדירה המתאימה</h1>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
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
              {filteredCities.map((city, index) => (
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
        {selectedCity && <h2 className="text-2xl font-semibold mb-4 text-gold text-center">דירות ב{selectedCity}</h2>}
        {apartments.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apartments.map(apartment => (
              <li key={apartment.property_id} className="bg-gray-800 p-4 rounded-lg border border-gold cursor-pointer">
                <p className="text-lg font-medium">שכונה/איזור: {apartment.neighborhood}</p>
                <p className="text-md text-gold">מחיר: {apartment.price} ש"ח</p>
                <p className="text-sm">חדרים: {apartment.rooms}</p>
                <ApartmentImages property_id={apartment.property_id} />
                <button
                  className="mt-4 bg-gold text-black px-6 py-2 rounded-md font-semibold"
                  onClick={() => handleApartmentClick(apartment)}
                >
                  לפרטים נוספים
                </button>

                {/* הצגת תוכן נוסף בכרטיסיה אם החוזה קיים */}
                {showModal && selectedApartment?.property_id === apartment.property_id && (
                  <>
                    {showDetails ? (
                      <div className="text-gold-500 text-center mt-4">
                        <p className="text-lg font-medium">צור קשר עם המוכר:  {apartment.contact_seller}</p>
                        <p className="text-md text-gold">כתובת: {apartment.address} ש"ח</p>
                      </div>
                    ) : (
                      <ContractModal property_type='apartment' selectedProperty={selectedApartment} onClose={handleCloseModal} />
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          selectedCity && <p className="text-gray-400 text-center">No apartments found for this city.</p>
        )}
      </div>
    </div>
  );
};

export default ApartmentList;
