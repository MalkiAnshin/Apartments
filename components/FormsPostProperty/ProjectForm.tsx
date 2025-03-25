import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProjectForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]); // State to hold errors
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // למנוע לחיצות מרובות

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user && user.userId) {
      setUserId(user.userId);
    }
  }, []);

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    console.log("City input changed:", searchTerm);
    setSelectedCity(searchTerm);
    if (searchTerm) {
      console.log("Fetching cities for term:", searchTerm);
      fetchCities(searchTerm);
    } else {
      console.log("Clearing city suggestions.");
      setCities([]);
    }
  };

  const handleCitySelect = (city: string) => {
    console.log("City selected:", city);
    setSelectedCity(city);
    setCities([]);
  };

  const fetchCities = async (searchTerm: string) => {
    try {
      console.log("Starting fetch for cities...");
      const response = await fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=d4901968-dad3-4845-a9b0-a57d027f11ab');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.success && data.result && data.result.records) {
        const cityList: string[] = data.result.records
          .map((record: any) => record['שם_ישוב'])
          .filter((city: string) => city !== '' && city.toLowerCase().includes(searchTerm.toLowerCase()));
        console.log("Cities fetched successfully:", cityList);
        setCities(cityList);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const validateForm = (formData: FormData) => {
    const errors: string[] = [];
    console.log("Validating form data...");

    if (!formData.get('city')) errors.push('העיר היא שדה חובה');
    if (!formData.get('neighborhood')) errors.push('השכונה היא שדה חובה');
    if (!formData.get('price')) errors.push('המחיר הוא שדה חובה');
    if (!formData.get('rooms')) errors.push('מספר החדרים הוא שדה חובה');
    if (!formData.get('floor')) errors.push('הקומה היא שדה חובה');
    if (!formData.get('contactSeller')) errors.push('דרכי יצירת קשר עם המוכר הם שדה חובה');
    if (!formData.get('address')) errors.push('הכתובת היא שדה חובה');
    if (!formData.get('isBuilt')) errors.push('לא ציינת האם הפרויקט בנוי או לא');
    if (images.length === 0) errors.push('יש להעלות תמונות של הנכס');

    if (errors.length > 0) {
      console.log("Form validation failed:", errors);
    } else {
      console.log("Form validation passed.");
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // אם כבר שולחים, לא מאפשרים לחיצה נוספת

    setIsSubmitting(true); // משנים ל-true לפני שליחת הבקשה

    console.log("🚀 התחלת שליחת טופס...");

    const formData = new FormData();
    const target = e.target as HTMLFormElement;

    formData.append('city', (target.city as HTMLInputElement).value);
    formData.append('neighborhood', (target.neighborhood as HTMLInputElement).value);
    formData.append('price', (target.price as HTMLInputElement).value);
    formData.append('propertyType', 'Project');
    formData.append('userId', userId || '');  // Use userId from localStorage
    formData.append('rooms', (target.rooms as HTMLInputElement).value);
    formData.append('hasBalcony', (target.hasBalcony as HTMLInputElement).checked ? 'true' : 'false');
    formData.append('floor', (target.floor as HTMLInputElement).value);
    formData.append('contactSeller', (target.contactSeller as HTMLInputElement).value);
    formData.append('address', (target.address as HTMLInputElement).value);
    formData.append('elevator', (target.elevator as HTMLInputElement).checked ? 'true' : 'false');
    formData.append('isBuilt', (target.isBuilt as HTMLInputElement).checked ? 'true' : 'false');
    formData.append('warehouse', (target.warehouse as HTMLInputElement).checked ? 'true' : 'false');
    formData.append('parking', (target.parking as HTMLInputElement).checked ? 'true' : 'false');

    images.forEach((image) => {
      formData.append('images', image);
    });
    // Log formData content
    console.log("Form data to be sent to the server:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    if (validateForm(formData)) {

      // ✅ לוג מפורט של כל הנתונים שנשלחים
      console.log("📤 שליחת נתונים לשרת:");
      formData.forEach((value, key) => {
        console.log(`👉 ${key}:`, value);
      });

      try {
        const response = await fetch('/api/postProperty', {
          method: 'POST',
          body: formData,
        });

        console.log("📩 תשובה שהתקבלה מהשרת:", response);

        const result = await response.json();
        console.log("📩 JSON שהתקבל מהשרת:", result);

        if (response.ok) {
          console.log("🎉 נכס נשמר בהצלחה:", result);
          alert('✅ נכס נקלט בהצלחה!');


          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            user.remainingListings = user.remainingListings - 1;
            localStorage.setItem('user', JSON.stringify(user));  // עדכון ה-user עם הערך החדש
          }


          router.push('/');
        } else {
          console.error("❌ שגיאה בשליחה לשרת:", result.error);
          alert('❌ שגיאה: ' + result.error);
        }
      } catch (error) {
        console.error("🔥 שגיאה כללית בשליחה:", error);
        alert('⚠️ שגיאה לא צפויה, בדוק את הקונסולה.');
      }
    }
    setIsSubmitting(false); // להחזיר ל-false לאחר סיום השליחה
  };

  return (
    <form onSubmit={handleSubmit} className="bg-transparent p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-center text-gold-500 mb-6">פרסום דירת פרויקט</h2>

      <div className="space-y-4">
        <div className="flex flex-col relative">
          <label className="text-xl text-white">עיר</label>
          <input
            type="text"
            value={selectedCity}
            onChange={handleCityChange}
            name="city"
            required
            className="p-2 rounded border-2 border-gold-500 bg-transparent text-white"
          />
          {cities.length > 0 && (
            <ul className="absolute bg-transparent text-gold border border-gold w-auto max-w-fit max-h-60 overflow-y-auto z-10 rounded-md mt-1 shadow-lg px-2 py-1 top-full left-0">
              {cities.map((city) => (
                <li
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="cursor-pointer hover:bg-gray-700 p-3"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">איזור/שכונה</label>
          <input type="text" name="neighborhood" required className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">מחיר</label>
          <input type="number" name="price" required className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">מספר חדרים</label>
          <input type="number" name="rooms" required className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">קומה</label>
          <input type="number" name="floor" required className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">דרכי יצירת קשר עם המוכר</label>
          <input type="text" name="contactSeller" required className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">כתובת</label>
          <input type="text" name="address" required className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">יש מרפסת?</label>
          <input type="checkbox" name="hasBalcony" className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">יש מעלית?</label>
          <input type="checkbox" name="elevator" className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">יש מחסן?</label>
          <input type="checkbox" name="warehouse" className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">יש חניה</label>
          <input type="checkbox" name="parking" className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">האם הדירה בנויה?</label>
          <input type="checkbox" name="isBuilt" className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>


        <div className="flex flex-col">
          <label className="text-xl text-white">תמונות הנכס</label>
          <input type="file" multiple onChange={(e) => setImages(Array.from(e.target.files || []))} className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <button type="submit" className="bg-gold-500 text-black py-2 px-4 rounded-lg w-full hover:bg-gold-600" disabled={isSubmitting}>
          שלח
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
