'use client';
import React, { useEffect, useState } from 'react';

const ShowSoldProperties: React.FC = () => {
  const [soldProperties, setSoldProperties] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // שליפת כל הדירות שנמכרו
  const fetchSoldProperties = async () => {
    try {
      const response = await fetch(`/api/AdminInterface/ShowSoldProperties`);
      if (!response.ok) {
        throw new Error('Response from server was not OK');
      }
      const data = await response.json();
      setSoldProperties(data);
    } catch (err) {
      setError('Error fetching sold properties: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSoldProperties();
  }, []);

  return (
    <div className="bg-transparent text-white min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">דירות שנמכרו</h1>
        {error && <div className="text-red-600 mb-4 text-center">שגיאה: {error}</div>}

        {/* טבלת דירות שנמכרו */}
        {soldProperties.length > 0 ? (
          <table className="min-w-full bg-transparent border border-gold mb-6">
            <thead>
              <tr className="border-b border-gold">
                <th className="text-left p-4">מזהה נכס</th>
                <th className="text-left p-4">נמכר ל</th>
                <th className="text-left p-4">מזהה מוכר</th>
                <th className="text-left p-4">תאריך מכירה</th>
                <th className="text-left p-4">מחיר</th>
                <th className="text-left p-4">פרטי יצירת קשר עם המוכר</th>

              </tr>
            </thead>
            <tbody>
              {soldProperties.map((property, index) => (
                <tr
                  key={`${property.property_id}-${index}`} // שימוש ב-id וב-index כ-key ייחודי
                  className={`border-b border-gold`}
                >
                  <td className="p-4">{property.property_id}</td>
                  <td className="p-4">{property.sold_to}</td>
                  <td className="p-4">{property.seller_id}</td>
                  <td className="p-4">{property.sold_date}</td>
                  <td className="p-4">{property.price}</td>
                  <td className="p-4">{property.contact_seller}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-center">...טוען</p>
        )}
      </div>
    </div>
  );
};

export default ShowSoldProperties;
