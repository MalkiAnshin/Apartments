'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Property {
  property_id: number;
  price: number;
  property_type: string;
  address: string;
  contact_seller?: string; // הוספת השדה contact_seller
}

const PersonalManagement = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    soldTo: '',
    soldDate: '',
    soldPrice: '',  // שדה חדש למחיר מכירה
    property_type: 'apartment',  // סוג נכס קבוע כ- 'APARTMENT'
    contact_seller: ''  // הוספת contact_seller
  });

  const router = useRouter();

  useEffect(() => {
    console.log('Checking for stored user in localStorage...');
    const storedUser = localStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser).userId : null;
    if (userId) {
      console.log(`User found: ${userId}`);
      setUserId(userId);
      fetchProperties(userId);
    } else {
      console.log('User not logged in. Redirecting to login page...');
      alert('משתמש לא מחובר, נא להתחבר!');
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/login');
    }
  }, []);

  const fetchProperties = async (userId: string) => {
    console.log(`Fetching properties for userId: ${userId}`);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/personalManagement?userId=${userId}`);
      if (!response.ok) {
        throw new Error('לא הצלחנו לשלוף את המידע.');
      }
      const data: Property[] = await response.json();
      console.log(`Fetched ${data.length} properties for userId: ${userId}. Data:`, data);
      setProperties(data);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (propertyId: number) => {
    setSelectedPropertyId(propertyId);

    // בקשת DELETE למחיקת הנכס
    fetch(`/api/personalManagement?propertyId=${propertyId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('לא הצלחנו למחוק את הנכס.');
        }

        // עדכון הנכסים לאחר המחיקה
        setProperties((prev) => prev.filter((p) => p.property_id !== propertyId));
        console.log('Property deleted successfully');
      })
      .catch((err: any) => {
        console.error('Error deleting property:', err);
        alert('שגיאה: ' + err.message);
      });
  };

  const handlePropertySelect = (property: Property) => {
    // עדכון הסטייט עם ערכים של הנכס הנבחר
    setSelectedPropertyId(property.property_id);
    setFormData({
      ...formData,
      soldTo: '',  // reset other fields if necessary
      soldDate: '',
      soldPrice: '',
      contact_seller: property.contact_seller || '',  // עדכון contact_seller עם הערך מהנכס
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.soldTo || !formData.soldDate || !formData.soldPrice) {
      alert('אנא מלא את כל השדות.');
      return;
    }

    console.log('Form data before submitting:', formData);

    try {
      const response = await fetch(`/api/personalManagement`, {
        method: 'POST',  // שינוי ל-POST במקום DELETE
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedPropertyId,
          property_type: "apartment",
          contact_seller: formData.contact_seller,  // כאן תשלח את contact_seller שמגיע מהנכס
          userId: userId,
          ...formData,
          sellerId: userId,  // הוספת sellerId
        }),
      });

      if (!response.ok) {
        throw new Error('לא הצלחנו לעדכן את נתוני המכירה.');
      }

      console.log('Property sale data saved successfully');
      // עדכון הנכסים לאחר שליחה
      setProperties((prev) => prev.filter((p) => p.property_id !== selectedPropertyId));
      setSelectedPropertyId(null);
      setFormData({ soldTo: '', soldDate: '', soldPrice: '', property_type: 'apartment', contact_seller: '' });
    } catch (err: any) {
      console.error('Error saving property sale data:', err);
      alert('שגיאה: ' + err.message);
    }
  };

  if (loading) {
    console.log('Loading data...');
    return <p className="text-center text-lg">טוען נתונים...</p>;
  }

  if (error) {
    console.log(`Error occurred: ${error}`);
    return <p className="text-center text-lg text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-semibold text-center text-gold mb-8">ניהול נכסים</h1>
      {properties.length === 0 ? (
        <p className="text-center text-lg text-darkGray">לא נמצאו נכסים.</p>
      ) : (
        <ul className="space-y-6">
          {properties.map((property) => (
            <li
              key={property.property_id}
              className="p-6 border border-gold rounded-lg shadow-xl bg-white hover:bg-gold-100 transition-all"
              onClick={() => handlePropertySelect(property)}  // בחר נכס בעת לחיצה
            >
              <p className="text-2xl text-gold font-semibold">כתובת: {property.address}</p>
              <p className="text-lg text-darkGray">סוג נכס: {property.property_type}</p>
              <p className="text-lg text-darkGray">מחיר: {property.price} ₪</p>
              <button
                className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                onClick={() => handleDeleteClick(property.property_id)}
              >
                מחק
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedPropertyId && (
        <form onSubmit={handleFormSubmit} className="space-y-4 mt-8">
          <h2 className="text-xl text-center font-semibold">פרטי מכירה</h2>
          <div>
            <label htmlFor="soldTo" className="block">נמכר ל:</label>
            <input
              id="soldTo"
              type="text"
              value={formData.soldTo}
              onChange={(e) => setFormData({ ...formData, soldTo: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="soldDate" className="block">תאריך מכירה:</label>
            <input
              id="soldDate"
              type="date"
              value={formData.soldDate}
              onChange={(e) => setFormData({ ...formData, soldDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="soldPrice" className="block">מחיר מכירה:</label>
            <input
              id="soldPrice"
              type="number"
              value={formData.soldPrice}
              onChange={(e) => setFormData({ ...formData, soldPrice: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all"
          >
            שמור נתוני מכירה
          </button>
        </form>
      )}
    </div>
  );
};

export default PersonalManagement;
