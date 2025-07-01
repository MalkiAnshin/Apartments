'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const UserSearchForm = () => {
  const router = useRouter();

  const [identityNumber, setIdentityNumber] = useState('');
  const [remainingListings, setRemainingListings] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSearch = async () => {
    console.log(`Searching for user with identity number: ${identityNumber}`);

    try {
      setLoading(true);
      const response = await fetch(`/api/AdminInterface/AddOptionPostForUser/user/${identityNumber}`);

      if (!response.ok) {
        console.error(`GET request failed with status: ${response.status}`);
        throw new Error('משתמש לא נמצא');
      }

      const data = await response.json();
      console.log('User data received:', data);
      setUserData(data);
      setError(null);
    } catch (err: any) {
      console.error('Error during search:', err);
      setError(err.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!remainingListings || isNaN(parseInt(remainingListings))) {
      alert('אנא הזן מספר תקין עבור יתרת הנפרסומים');
      return;
    }

    setIsConfirming(true);

    try {
      console.log("Making PATCH request for identityNumber:", identityNumber);

      const response = await fetch(`/api/AdminInterface/AddOptionPostForUser/user/${identityNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incrementValue: parseInt(remainingListings),
        }),
      });

      if (!response.ok) {
        console.log("PATCH request failed with status:", response.status);
        throw new Error('לא ניתן לעדכן את המשתמש');
      }

      const data = await response.json();
      console.log("Response data:", data);
      alert(data.message);

      // עדכון ב-localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const currentRemaining = Number(user.remaining_listings ?? 0);
        const increment = parseInt(remainingListings);

        user.remaining_listings = currentRemaining + increment;

        localStorage.setItem('user', JSON.stringify(user));
        setUserData(user); // עדכון UI
      }

      router.push('/');

    } catch (err: any) {
      console.error("Error during confirm:", err);
      alert(err.message);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-50" dir="rtl">
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
            <p className="text-xl mb-4">יתרת פרסומים נוכחית: {userData.remaining_listings}</p>

            <p className="mb-4">האם אתה בטוח רוצה לאפשר למשתמש זה אפשרות פרסום?</p>
            <input
              type="number"
              value={remainingListings}
              onChange={(e) => setRemainingListings(e.target.value)}
              placeholder="הזן יתרת פרסומים"
              className="w-full p-3 mb-4 text-black rounded-lg border border-gold focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold-dark transition duration-200"
                disabled={isConfirming}
              >
                {isConfirming ? 'מאשר...' : 'אישור'}
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
