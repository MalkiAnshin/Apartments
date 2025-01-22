'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // הוספת useRouter


const UserSearchForm = () => {
  const router = useRouter(); // העברת הגדרת router כאן

  const [identityNumber, setIdentityNumber] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    console.log(`Searching for user with identity number: ${identityNumber}`); // לוג של מספר זהות לפני קריאה ל-API
  
    try {
      setLoading(true);
      const response = await fetch(`/api/AdminInterface/AddOptionPostForUser/user/${identityNumber}`);
    
      if (!response.ok) {
        console.error(`GET request failed with status: ${response.status}`); // לוג במקרה של שגיאה בקבלת תשובה מה-API
        throw new Error('משתמש לא נמצא');
      }
    
      const data = await response.json();
      console.log('User data received:', data); // לוג במקרה של קבלת נתוני משתמש
      setUserData(data);
      setError(null); // מנקה את השגיאה אם נמצא
    } catch (err: any) {
      console.error('Error during search:', err); // לוג במקרה של שגיאה בעת חיפוש
      setError(err.message);
      setUserData(null); // מנקה את המידע אם יש שגיאה
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirm = async () => {
    try {
      console.log("Making PATCH request for identityNumber:", identityNumber);  // לוג של הבקשה
  
      const response = await fetch(`/api/AdminInterface/AddOptionPostForUser/user/${identityNumber}`, {
        method: 'PATCH',
      });
  
      if (!response.ok) {
        console.log("PATCH request failed with status:", response.status);  // לוג אם הבקשה לא הצליחה
        throw new Error('לא ניתן לעדכן את המשתמש');
      }
  
      const data = await response.json();
      console.log("Response data:", data);  // לוג של התגובה מהשרת
      alert(data.message); // מציג הודעה שהעדכון בוצע בהצלחה
      router.push('/'); // החלף את הנתיב לפי הצורך שלך

    } catch (err: any) {
      console.error("Error during confirm:", err);  // לוג של שגיאה אם לא הצלחנו לבצע את הבקשה
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-50">
      <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gold mb-6">חיפוש משתמש</h2>
        <input 
          type="text" 
          value={identityNumber} 
          onChange={(e) => setIdentityNumber(e.target.value)} 
          placeholder="הכנס מספר זהות"
          className="w-full p-3 mb-4 text-black rounded-lg border border-gold focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <button 
          onClick={handleSearch} 
          className="w-full p-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold-dark transition duration-200"
          disabled={loading}
        >
          {loading ? 'מחפש...' : 'חפש'}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {userData && (
          <div className="mt-6 text-center">
            <p className="text-xl mb-4">שם המשתמש: {userData.name}</p>
            <p className="mb-4">האם אתה בטוח רוצה לאפשר למשתמש זה אפשרות פרסום?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={handleConfirm} 
                className="px-6 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold-dark transition duration-200"
              >
                אישור
              </button>
              <button 
                onClick={() => setUserData(null)} 
                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200"
              >
                ביטול
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearchForm;
