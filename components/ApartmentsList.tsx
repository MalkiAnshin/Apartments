import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContractModal from './ContractModal';
import ApartmentImages from './ApartmentImages';
import CitySelector from './CitySelector';
import Filters from './Filters';

const ApartmentList: React.FC = () => {
  const [apartments, setApartments] = useState<any[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ minPrice?: number; maxPrice?: number; rooms?: string }>({});
  const [error, setError] = useState<string | null>(null);

  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser).userId : null;


  const router = useRouter();

  // Define setPriceFilter and setRoomsFilter functions to update the filters state
  const setPriceFilter = (price: { min: number; max: number }) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      minPrice: price.min,
      maxPrice: price.max,
    }));
  };

  const setRoomsFilter = (rooms: number) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      rooms: rooms.toString(),
    }));
  };

  // Fetch apartments when city or filters change
  useEffect(() => {
    const fetchApartments = async () => {
      const query = new URLSearchParams();
      if (selectedCity) query.append('city', selectedCity);
      if (filters.minPrice) query.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) query.append('maxPrice', filters.maxPrice.toString());
      if (filters.rooms) query.append('rooms', filters.rooms);

      try {
        const response = await fetch(`/api/apartments?${query.toString()}`);
        if (!response.ok) throw new Error(`Failed to fetch data, status: ${response.status}`);
        const data = await response.json();
        setApartments(data);

      } catch (err) {
        console.error("Error fetching apartments:", err);
        setError('Error fetching apartments');
      }
    };

    if (selectedCity) fetchApartments();
  }, [selectedCity, filters]);

  const handleApartmentClick = (apartment: any) => {
    if (!userId) {
      router.push('/login');
    }
    checkContract(apartment.property_id, "apartment");
    setSelectedApartment(apartment);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApartment(null);
  };

  const checkContract = async (apartmentId: string, propertyType: string) => {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').userId || null;
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/moreDetailsApartments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apartmentId, userId, propertyType }),
      });

      if (!response.ok) throw new Error(`Network response was not ok`);

      const data = await response.json();

      if (data.exists) {
        // אם החוזה קיים, אפשר להציג את המידע המלא
        setSelectedApartment(prev => ({
          ...prev,
          moreDetails: true, // לדוגמה, פשוט מסמן שהמידע המלא זמין
        }));
        (prev => ({ ...prev, moreDetails: data.details }));
      } else {
        // If contract doesn't exist (false), show the modal
        setShowModal(true);
      }
    } catch (err) {
      setError(`Error checking contract: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
  };

  return (
    <div className="text-white min-h-screen flex flex-col items-center p-6 rtl">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">מצא את הדירה המתאימה</h1>

        {/* City Selector Component */}
        <CitySelector onCitySelect={setSelectedCity} />

        {/* Display Filters and Apartments only if a city is selected */}
        {selectedCity && (
          <>
            <Filters
              onPriceChange={setPriceFilter}
              onRoomsChange={setRoomsFilter}
            />
            <h2 className="text-2xl font-semibold mb-4 text-gold text-center">דירות ב{selectedCity}</h2>
            {apartments.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {apartments.map(apartment => (
                  <li
                    key={apartment.property_id}
                    className="bg-gray-800 p-4 rounded-lg border border-gold cursor-pointer rtl"
                  >
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
                    {showModal && selectedApartment?.property_id === apartment.property_id && (
                      <ContractModal
                        selectedProperty={selectedApartment}
                        property_type="apartment"
                        onClose={handleCloseModal}
                      />
                    )}
                    {selectedApartment?.property_id === apartment.property_id && !showModal && (
                      <div className="mt-4 text-gold">
                        {/* Show additional apartment details when contract exists */}
                        <p>כתובת: {apartment.address}</p>
                        <p>פרטי יצירת קשר: {apartment.contact_seller}</p>
                        {/* Add more fields as needed */}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-xl text-gray-400 mt-4">לא נמצאו דירות מתאימות.</p>
            )}
          </>
        )}
      </div>
      {error && <div className="text-red-600 text-center mt-4">{error}</div>}
    </div>
  );
};

export default ApartmentList;
