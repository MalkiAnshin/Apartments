import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContractModal from './ContractModal';
import ApartmentImages from './ApartmentImages';
import CitySelector from './CitySelector'; // ייבוא הקומפוננטה החדשה

import Filters from './Filters';

const ApartmentList: React.FC = () => {
  const [apartments, setApartments] = useState<any[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<{ min: number, max: number } | null>(null);
  const [roomsFilter, setRoomsFilter] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/moreDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apartmentId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok. Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      setShowDetails(data.exists);
    } catch (err) {
      setError(`Error checking contract: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
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







  useEffect(() => {
    fetchFilteredApartments();
  }, [selectedCity, priceFilter, roomsFilter]);
    
  const fetchFilteredApartments = async () => {
    let url = `/api/apartments?`;
    if (selectedCity) url += `city=${selectedCity}&`;
    if (priceFilter) url += `minPrice=${priceFilter.min}&maxPrice=${priceFilter.max}&`;
    if (roomsFilter !== null) url += `rooms=${roomsFilter}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data, status: ${response.status}`);
      }

      const data = await response.json();
      setApartments(data);
    } catch (err) {
      console.error("Error fetching filtered apartments:", err);
      setError('Error fetching apartments');
    }
  };







  return (
    <div className="text-white min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">מצא את הדירה המתאימה</h1>
        <CitySelector onCitySelect={setSelectedCity} /> {/* הוספת קומפוננטת CitySelector */}
        <Filters onPriceChange={setPriceFilter} onRoomsChange={setRoomsFilter} />
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
                  <div className="relative z-50">
                    {showDetails ? (
                      <div className="text-gold-500 text-center mt-4">
                        <p className="text-lg font-medium">צור קשר עם המוכר:  {apartment.contact_seller}</p>
                        <p className="text-md text-gold">כתובת: {apartment.address}</p>
                      </div>
                    ) : (
                      <ContractModal property_type='apartment' selectedProperty={selectedApartment} onClose={handleCloseModal} />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          selectedCity && <p className="text-gray-400 text-center">.לא נמצאו דירות התואמות לנתוני החיפוש</p>
        )}
      </div>
    </div>
  );
};

export default ApartmentList;
