import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContractModal from './ContractModal';  // לא השתנה
import CitySelector from './CitySelector';   // לא השתנה

const BusinessList: React.FC = () => {
  const [business, setBusiness] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // const storedUser = localStorage.getItem('user');
  // const userId = storedUser ? JSON.parse(storedUser).userId : null;



  const router = useRouter();

  useEffect(() => {
    const fetchBusiness = async () => {
      const query = new URLSearchParams();
      if (selectedCity) query.append('city', selectedCity);

      try {
        const response = await fetch(`/api/business?${query.toString()}`);
        if (!response.ok) throw new Error(`Failed to fetch data, status: ${response.status}`);
        const data = await response.json();
        setBusiness(data);
      } catch (err) {
        console.error("Error fetching business:", err);
        setError('Error fetching business');
      }
    };

    if (selectedCity) fetchBusiness();
  }, [selectedCity]);

  const handleBusinessClick = (business: any) => {
    const storedUser = localStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser).userId : null;

    if (!userId) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);

      router.push('/login');
      return;
    }

    checkContract(business.property_id, "business"); // ודאי ש-property_id קיים ואינו undefined
    setSelectedBusiness(business);
  };


  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBusiness(null);
  };

  const checkContract = async (property_id: string, property_type: string) => {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').userId || null;

    if (!userId) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);

      router.push('/login');
      return;
    }

    try {
      const payload = { property_id, userId, property_type };

      const response = await fetch(`/api/moreDetailsBusiness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error response from server:", errorDetails);
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();

      if (data.exists) {
        setSelectedBusiness(prev => ({
          ...prev,
          moreDetails: true,
          additionalDetails: data.additionalDetails,
        }));
      } else {
        setShowModal(true);
      }
    } catch (err) {
      setError(`Error checking contract: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
      console.error("Error checking contract:", err);
    }
  };
  return (
    <div className="text-white min-h-screen flex flex-col items-center p-6 rtl">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">מצא את העסק המתאים</h1>

        <CitySelector onCitySelect={setSelectedCity} />

        {selectedCity && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gold text-center">בתי עסק ב{selectedCity}</h2>
            {business.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {business.map((business_index, index) => (
                  <li
                    key={`${business_index.property_id}-${index}`}
                    className="bg-gray-800 p-4 rounded-lg border border-gold cursor-pointer rtl"
                  >
                    <p className="text-lg font-medium">שכונה/איזור: {business_index.neighborhood}</p>
                    <p className="text-md text-gold">
                      מחיר: {Number(business_index.price).toLocaleString('he-IL', { maximumFractionDigits: 0 })} ש"ח
                    </p>
                    <p className="text-sm">סוג נכס: {business_index.business_type}</p>
                    <p className="text-sm">תשואה חודשית: {business_index.monthly_yield} ש"ח</p>

                    <button
                      className="mt-4 bg-gold text-black px-6 py-2 rounded-md font-semibold"
                      onClick={() => handleBusinessClick(business_index)}
                    >
                      לפרטים נוספים
                    </button>
                    {showModal && selectedBusiness?.property_id === business_index.property_id && (
                      <ContractModal
                        selectedProperty={selectedBusiness}
                        property_type="business"
                        onClose={handleCloseModal}
                      />
                    )}
                    {selectedBusiness?.property_id === business_index.property_id && !showModal && selectedBusiness?.moreDetails && (
                      <div className="mt-4 text-gold">
                        <p>כתובת: {business_index.address}</p>
                        <p>פרטי יצירת קשר: {business_index.contact_info}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-xl text-gray-400 mt-4">לא נמצאו בתי עסק מתאימים.</p>
            )}
          </>
        )}
      </div>
      {error && <div className="text-red-600 text-center mt-4">{error}</div>}
    </div>
  );
};

export default BusinessList;
