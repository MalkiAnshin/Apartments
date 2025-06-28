'use client';
import React, { useEffect, useState } from 'react';

const ShowUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [apartments, setApartments] = useState<any[]>([]);
  const [isContractsModalOpen, setIsContractsModalOpen] = useState(false);
  const [isApartmentsModalOpen, setIsApartmentsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);


  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/AdminInterface/ShowUsers');
      if (!response.ok) {
        throw new Error('תגובה מהשרת לא הייתה תקינה');
      }
      const data = await response.json();
      setUsers(data);

    } catch (err) {
      setError('שגיאה בזמן Fetch המשתמשים: ' + (err instanceof Error ? err.message : 'אירעה שגיאה לא ידועה'));
      console.error('שגיאה בזמן Fetch המשתמשים:', err);
    }
  };

  const fetchContracts = async (identity_number: string) => {
    try {
      const response = await fetch(`/api/AdminInterface/users/${identity_number}/contracts`);
      if (!response.ok) {
        throw new Error('שגיאה בזמן קבלת החוזים');
      }

      const data = await response.json();
      setContracts(data);
      setIsContractsModalOpen(true); // פותח את מודל החוזים

    } catch (err) {
      console.error(`שגיאה בזמן Fetch חוזים של המשתמש ${identity_number}:`, err);
    }
  };

  const fetchApartments = async (identity_number: string) => {
    try {
      const response = await fetch(`/api/AdminInterface/users/${identity_number}/apartments`);

      if (!response.ok) {
        throw new Error('שגיאה בזמן קבלת הדירות');
      }

      const data = await response.json();
      setApartments(data);
      setIsApartmentsModalOpen(true); // פותח את מודל הדירות

    } catch (err) {
      console.error(`שגיאה בזמן Fetch דירות של המשתמש ${identity_number}:`, err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
    <div className="bg-black/70 text-gold min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gold text-center border-b-2 border-gold pb-2 shadow-gold-glow">
          רשימת משתמשים
        </h1>
        {error && <div className="text-red-600 mb-4 text-center">שגיאה: {error}</div>}

        {/* טבלת המשתמשים */}
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent border border-gold rounded-lg overflow-hidden shadow-lg mb-6">
              <thead>
                <tr className="border-b border-gold text-gold bg-transparent">
                  <th className="text-left p-4">סוג משתמש</th>
                  <th className="text-left p-4">תפקיד</th>
                  <th className="text-left p-4">אימייל</th>
                  <th className="text-left p-4">שם משתמש</th>
                  <th className="text-left p-4">מזהה משתמש</th>
                  <th className="text-center p-4">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.identity_number}
                    className="border-b border-gold hover:bg-gold/10 transition text-shadow"
                  >
                    <td className="p-4 text-gold">{user.user_type}</td>
                    <td className="p-4 text-gold">{user.role}</td>
                    <td className="p-4 text-gold">{user.email}</td>
                    <td className="p-4 text-gold">{user.username}</td>
                    <td className="p-4 text-gold">{user.identity_number}</td>
                    <td className="p-4 flex justify-center items-center space-x-4">
                      <button
                        className="bg-transparent border border-gold text-gold py-1 px-3 rounded hover:bg-gold hover:text-black transition shadow-gold-glow"
                        onClick={() => fetchContracts(user.identity_number)}
                      >
                        חוזים
                      </button>
                      <button
                        className="bg-transparent border border-gold text-gold py-1 px-3 rounded hover:bg-gold hover:text-black transition shadow-gold-glow"
                        onClick={() => fetchApartments(user.identity_number)}
                      >
                        דירות
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center">...טוען</p>
        )}

        {/* Modal for Contracts */}
        {isContractsModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-black text-gold p-6 rounded-lg max-w-4xl w-full">
              <h2 className="text-2xl font-bold mb-4">חוזים</h2>
              <button
                onClick={() => setIsContractsModalOpen(false)} // סגירת המודל
                className="text-red-500 mb-4 text-lg"
              >
                סגור
              </button>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-transparent border border-gold rounded-lg overflow-hidden shadow-lg">
                  <thead>
                    <tr className="border-b border-gold text-gold">
                      <th className="p-4">מזהה נכס</th>
                      <th className="p-4">סוג נכס</th>
                      <th className="p-4 text-center">תאריך</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract, index) => (
                      <tr key={index} className="border-b border-gold hover:bg-gold/10 transition">
                        <td className="p-4 text-gold">{contract.contract_id}</td>
                        <td className="p-4 text-gold">{contract.property_type}</td>
                        <td className="p-4 text-gold">{contract.signed_date}</td>
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

        {/* Modal for Apartments */}
        {isApartmentsModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-black text-gold p-6 rounded-lg max-w-6xl w-full">
              <h2 className="text-2xl font-bold mb-4">דירות</h2>
              <button
                onClick={() => setIsApartmentsModalOpen(false)} // סגירת המודל
                className="text-red-500 mb-4 text-lg"
              >
                סגור
              </button>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-transparent border border-gold rounded-lg overflow-hidden shadow-lg">
                  <thead>
                    <tr className="border-b border-gold text-gold text-left">
                      <th className="p-4">מזהה נכס</th>
                      <th className="p-4">עיר</th>
                      <th className="p-4">שכונה</th>
                      <th className="p-4">מחיר</th>
                      <th className="p-4">חדרים</th>
                      <th className="p-4">כתובת</th>
                      <th className="p-4">קומה</th>
                      <th className="p-4">מרפסת</th>
                      <th className="p-4">מעלית</th>
                      <th className="p-4">מחסן</th>
                      <th className="p-4">חניה</th>
                      <th className="p-4">מוכר</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apartments.map((apartment, index) => (
                      <tr key={index} className="border-b border-gold hover:bg-gold/10 transition">
                        <td className="p-4">{apartment.property_id}</td>
                        <td className="p-4">{apartment.city}</td>
                        <td className="p-4">{apartment.neighborhood}</td>
                        <td className="p-4">
                          {Number(apartment.price).toLocaleString('he-IL', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="p-4">{apartment.rooms}</td>
                        <td className="p-4">{apartment.address}</td>
                        <td className="p-4">{apartment.floor}</td>
                        <td className="p-4">{apartment.has_balcony ? "כן" : "לא"}</td>
                        <td className="p-4">{apartment.elevator ? "כן" : "לא"}</td>
                        <td className="p-4">{apartment.warehouse ? "כן" : "לא"}</td>
                        <td className="p-4">{apartment.parking ? "כן" : "לא"}</td>
                        <td className="p-4">{apartment.contact_seller}</td>
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

export default ShowUsers;
