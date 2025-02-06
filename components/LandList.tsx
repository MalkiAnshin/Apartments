import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContractModal from './ContractModal';  // לא השתנה
import CitySelector from './CitySelector';   // לא השתנה

const LandList: React.FC = () => {
  const [lands, setLands] = useState<any[]>([]);
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser).userId : null;

  const router = useRouter();

  // Fetch lands when city changes
  useEffect(() => {
    const fetchLands = async () => {
      const query = new URLSearchParams();
      if (selectedCity) query.append('city', selectedCity);

      try {
        const response = await fetch(`/api/lands?${query.toString()}`);
        if (!response.ok) throw new Error(`Failed to fetch data, status: ${response.status}`);
        const data = await response.json();
        setLands(data);
        console.log(data);

      } catch (err) {
        console.error("Error fetching lands:", err);
        setError('Error fetching lands');
      }
    };

    if (selectedCity) fetchLands();
  }, [selectedCity]);

  const handleLandClick = (land: any) => {
    if (!userId) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);

      router.push('/login');
    }
    checkContract(land.property_id, "land");
    setSelectedLand(land);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLand(null);
  };

  const checkContract = async (landId: string, propertyType: string) => {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').userId || null;
    if (!userId) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);

      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/moreDetailsLands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landId, userId, propertyType }),
      });

      if (!response.ok) throw new Error(`Network response was not ok`);

      const data = await response.json();
      console.log("Received data: ", data);

      if (data.exists) {
        // במקרה של קיומו של חוזה/פרטי מידע נוספים
        setSelectedLand(prev => ({
          ...prev,
          moreDetails: true,
          additionalDetails: data.additionalDetails, // הנח שהנתונים הנוספים נמצאים ב-additionalDetails
        }));
      } else {
        setShowModal(true);
      }
    } catch (err) {
      setError(`Error checking contract: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
  };

  return (
    <div className="text-white min-h-screen flex flex-col items-center p-6 rtl">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">מצא את הקרקע המתאימה</h1>

        <CitySelector onCitySelect={setSelectedCity} />

        {selectedCity && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gold text-center">קרקעות ב{selectedCity}</h2>
            {lands.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lands.map(land => (
                  <li
                    key={land.property_id}
                    className="bg-gray-800 p-4 rounded-lg border border-gold cursor-pointer rtl"
                  >
                    <p className="text-lg font-medium">שכונה/איזור: {land.neighborhood}</p>
                    <p className="text-md text-gold">מחיר: {land.price} ש"ח</p>
                    <p className="text-sm">גודל: {land.size} מ"ר</p>
                    <p className="text-sm">
                      {land.buildable_area ? "השטח בנוי" : "השטח אינו בנוי"}
                    </p>

                    <button
                      className="mt-4 bg-gold text-black px-6 py-2 rounded-md font-semibold"
                      onClick={() => handleLandClick(land)}
                    >
                      לפרטים נוספים
                    </button>
                    {showModal && selectedLand?.property_id === land.property_id && (
                      <ContractModal
                        selectedProperty={selectedLand}
                        property_type="land"
                        onClose={handleCloseModal}
                      />
                    )}
                    {selectedLand?.property_id === land.property_id && !showModal && selectedLand.moreDetails && (
                      <div className="mt-4 text-gold">
                        <p>כתובת: {land.address}</p>
                        <p>פרטי יצירת קשר: {land.contact_info}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-xl text-gray-400 mt-4">לא נמצאו קרקעות מתאימות.</p>
            )}
          </>
        )}
      </div>
      {error && <div className="text-red-600 text-center mt-4">{error}</div>}
    </div>
  );
};

export default LandList;
