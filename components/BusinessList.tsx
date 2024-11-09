import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContractModal from './ContractModal';
import BusinessImages from './BusinessImages';
import CitySelector from './CitySelector';

const BusinessList: React.FC = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    console.log('Component mounted. Initial selected city:', selectedCity);

    if (selectedCity) {
      const fetchBusinesses = async () => {
        console.log('Fetching businesses for city:', selectedCity);
        try {
          const response = await fetch(`/api/business?city=${selectedCity}`);
          console.log('Response status:', response.status);

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error data:', errorData);
            throw new Error(`Network response was not ok. Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
          }

          const data = await response.json();
          console.log('Fetched businesses data:', data);

          if (Array.isArray(data)) {
            setBusinesses(data);
            console.log('Businesses updated successfully:', data);
          } else {
            throw new Error('Unexpected data format');
          }
        } catch (err) {
          console.error('Error fetching businesses:', err);
          setError(`Error fetching businesses: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
        }
      };

      fetchBusinesses();
    } else {
      console.log('No city selected. Skipping fetch.');
    }
  }, [selectedCity]);







  const checkContract = async (businessId: string) => {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').userId || null;
    console.log('Checking contract for businessId:', businessId, 'with userId:', userId);

    if (!userId) {
      console.warn('User not logged in, redirecting to login');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/moreDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId, userId }),
      });

      console.log('Check contract response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error data from check contract:', errorData);
        throw new Error(`Network response was not ok. Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Contract data received:', data);
      setShowDetails(data.exists);
    } catch (err) {
      console.error('Error checking contract:', err);
      setError(`Error checking contract: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
  };

  const handleBusinessClick = (business: any) => {
    console.log('Business clicked:', business);
    checkContract(business.property_id);
    setSelectedBusiness(business);
    setShowModal(true);
    console.log('Modal state updated to show for business:', business.property_id);
  };

  const handleCloseModal = () => {
    console.log('Closing modal for business:', selectedBusiness?.property_id);
    setShowModal(false);
    setSelectedBusiness(null);
  };

  return (
    <div className="text-white min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">מצא את העסק המתאים</h1>
        <CitySelector onCitySelect={setSelectedCity} />
        {selectedCity && <h2 className="text-2xl font-semibold mb-4 text-gold text-center">עסקים ב{selectedCity}</h2>}
        {businesses.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map(business => (
              <li key={business.property_id} className="bg-gray-800 p-4 rounded-lg border border-gold cursor-pointer">
                <p className="text-lg font-medium">שכונה/איזור: {business.neighborhood}</p>
                <p className="text-md text-gold">מחיר: {business.price} ש"ח</p>
                <p className="text-sm">חדרים: {business.rooms}</p>
                <BusinessImages property_id={business.property_id} />
                <button
                  className="mt-4 bg-gold text-black px-6 py-2 rounded-md font-semibold"
                  onClick={() => handleBusinessClick(business)}
                >
                  לפרטים נוספים
                </button>
                {showModal && selectedBusiness?.property_id === business.property_id && (
                  <div className="relative z-50">
                    {showDetails ? (
                      <div className="text-gold text-center mt-4">
                        <p className="text-lg font-medium">צור קשר עם המוכר: {business.contact_seller}</p>
                        <p className="text-md text-gold">כתובת: {business.address}</p>
                      </div>
                    ) : (
                      <ContractModal property_type="business" selectedProperty={selectedBusiness} onClose={handleCloseModal} />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          selectedCity && <p className="text-gray-400 text-center">No businesses found for this city.</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default BusinessList;
