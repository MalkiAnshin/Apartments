'use client'
import React, { useEffect, useState } from 'react';
import Filters from '../../../../components/Filters';
import CitySelector from '../../../../components/CitySelector'; // Import the CitySelector component

const ShowApartments: React.FC = () => {
  const [apartments, setApartments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({ min: 0, max: 100000000 });
  const [roomsFilter, setRoomsFilter] = useState<number>(0);
  const [contracts, setContracts] = useState<any[]>([]); // State for contracts
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null); // State for selected property
  const [isContractsModalOpen, setIsContractsModalOpen] = useState(false);

  // Fetch apartments from API
  const fetchApartments = async () => {
    try {
      const encodedCity = encodeURIComponent(selectedCity?.trim() || '');
      const response = await fetch(`/api/AdminInterface/ShowAsset/ShowApartments?city=${encodedCity}`);
      if (!response.ok) {
        throw new Error('Response from server was not OK');
      }
      const data = await response.json();
      setApartments(data);
    } catch (err) {
      setError('Error fetching apartments: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error(err);
    }
  };

  // פונקציה למחיקת דירה
  const deleteApartment = async (propertyId: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק דירה זו?')) {
      return;
    }
    try {
      const response = await fetch(`/api/AdminInterface/DeletedAsset/DeleteApartment?property_id=${propertyId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('מחיקה נכשלה');
      }
      alert('הדירה נמחקה בהצלחה');
      // ריענון הרשימה
      setApartments(apartments.filter((apartment) => apartment.property_id !== propertyId));
    } catch (err) {
      setError('Error deleting apartment: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error(err);
    }
  };


  const fetchContracts = async (propertyId: string) => {
    try {
      setSelectedProperty(propertyId); // Highlight the selected property
      const response = await fetch(`/api/AdminInterface/contracts?property_id=${propertyId}`);
      if (!response.ok) {
        throw new Error('Response from server was not OK');
      }
      const data = await response.json();
      setContracts(data);
      setIsContractsModalOpen(true); // פותח את מודל החוזים

    } catch (err) {
      setError('Error fetching contracts: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, [selectedCity]);

  // Filter apartments
  const filteredApartments = apartments.filter((apartment) => {
    const isInPriceRange = apartment.price >= priceFilter.min && apartment.price <= priceFilter.max;
    const isInRoomsRange = roomsFilter ? apartment.rooms === roomsFilter : true;
    return isInPriceRange && isInRoomsRange;
  });


  const handleShowPDF = (propertyType: string, propertyId: string) => {
    // יצירת URL לקובץ ה-PDF
    const pdfUrl = `/contracts/${propertyType}/${propertyId}/contract.pdf`;
    // פתיחת הקובץ בחלון חדש
    try {
      window.open(pdfUrl, '_blank');
      console.log('נפתח חלון חדש עם ה-PDF');
    } catch (error) {
      console.error('שגיאה בפתיחת ה-PDF:', error);
    }
  };

  const handleShowID = (propertyType: string, propertyId: string) => {
    // יצירת ה-URLים עבור PNG ו-JPG
    const pngUrl = `/contracts/${propertyType}/${propertyId}/id_image.png`;
    const jpgUrl = `/contracts/${propertyType}/${propertyId}/id_image.jpg`;

    // ננסה לפתוח את ה-PNG קודם
    const tryOpenFile = (url: string) => {
      window.open(url, '_blank');
    };

    tryOpenFile(pngUrl); // לנסות לפתוח את ה-PNG
    tryOpenFile(jpgUrl); // לנסות לפתוח את ה-JPG אם ה-PNG לא קיים
  };


  return (
    <div className="bg-transparent text-white min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">רשימת דירות</h1>
        {error && <div className="text-red-600 mb-4 text-center">שגיאה: {error}</div>}

        {/* Filters */}
        <Filters
          onPriceChange={setPriceFilter}
          onRoomsChange={setRoomsFilter}
        />

        {/* City selector */}
        <CitySelector onCitySelect={setSelectedCity} />

        {/* Apartments list */}
        {filteredApartments.length > 0 ? (
          <table className="min-w-full bg-transparent border border-gold mb-6">
            <thead>
              <tr className="border-b border-gold">
                <th className="text-left p-4">מזהה נכס</th>
                <th className="text-left p-4">עיר</th>
                <th className="text-left p-4">מחיר</th>
                <th className="text-left p-4">חדרים</th>
                <th className="text-left p-4">פעולה</th>
              </tr>
            </thead>
            <tbody>
              {filteredApartments.map((apartment) => (
                <tr key={apartment.property_id} className={`border-b border-gold ${selectedProperty === apartment.property_id ? 'bg-gold/10' : ''}`}>
                  <td className="p-4">{apartment.property_id}</td>
                  <td className="p-4">{apartment.city}</td>
                  <td className="p-4">{apartment.price}</td>
                  <td className="p-4">{apartment.rooms}</td>
                  <button
                    onClick={() => deleteApartment(apartment.property_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    מחק דירה
                  </button>

                  <td className="p-4">
                    <button
                      onClick={() => fetchContracts(apartment.property_id)}
                      className="bg-gold text-black px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      הצג חוזים
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-center">...טוען</p>
        )}


        {/* Modal for Contracts */}
        {isContractsModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-black text-gold p-6 rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
              <h2 className="text-2xl font-bold mb-4">חוזים</h2>
              <button
                onClick={() => setIsContractsModalOpen(false)} // סגירת המודל
                className="text-red-500 mb-4 text-lg"
              >
                סגור
              </button>
              <div className="overflow-x-auto max-h-80"> {/* גלילה עבור הטבלה */}
                <table className="min-w-full bg-transparent border border-gold rounded-lg overflow-hidden shadow-lg">
                  <thead>
                    <tr className="border-b border-gold text-gold">
                      <th className="p-4">מזהה חוזה</th>
                      <th className="p-4">מזהה נכס</th>
                      <th className="p-4">סוג נכס</th>
                      <th className="p-4 text-center">תאריך</th>
                      <th className="p-4">מזהה משתמש</th>


                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract, index) => (
                      <tr
                        key={index}
                        className="border-b border-gold hover:bg-gold/10 transition"
                      >
                        <td className="p-4 text-gold">{contract.contract_id}</td>
                        <td className="p-4 text-gold">{contract.property_id}</td>
                        <td className="p-4 text-gold">{contract.property_type}</td>
                        <td className="p-4 text-gold">{contract.signed_date}</td>
                        <td className="p-4 text-gold">{contract.user_id}</td>

                        <td className="p-4 text-center">
                          <button
                            className="bg-transparent border border-gold text-gold py-1 px-3 rounded hover:bg-gold hover:text-black transition shadow-gold-glow"
                            onClick={() => handleShowPDF(contract.property_type, contract.contract_id)}
                          >
                            הצגת החוזה
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            className="bg-transparent border border-gold text-gold py-1 px-3 rounded hover:bg-gold hover:text-black transition shadow-gold-glow"
                            onClick={() => handleShowID(contract.property_type, contract.contract_id)} // העברת סוג הנכס והמזהה
                          >
                            הצגת צילום ת.ז.
                          </button>




                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}




      </div>
    </div>
  );
};

export default ShowApartments;
