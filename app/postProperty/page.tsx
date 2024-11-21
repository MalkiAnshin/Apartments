'use client'

import { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useRouter } from 'next/navigation';

const AddPropertyForm: React.FC = () => {
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [rooms, setRooms] = useState<number | string>(''); // Use number or string
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [propertyType, setPropertyType] = useState<string>('Apartment');
  const [parking, setParking] = useState<boolean>(false); // New state for parking
  const [warehouse, setWarehouse] = useState<boolean>(false); // New state for warehouse
  const [elevator, setElevator] = useState<boolean>(false); // New state for elevator
  const [address, setAddress] = useState<string>(''); // New state for address
  const [contactSeller, setContactSeller] = useState<string>(''); // New state for seller contact
  const [hasBalcony, setHasBalcony] = useState<boolean>(false); // New state for seller contact
  const [floor, setFloor] = useState<number | string>(''); // New state for seller contact

  const router = useRouter();

  const { user, userId, firstListingFree, setFirstListingFree } = useGlobalContext(); // Add firstListingFree

  useEffect(() => {
    if (!user) {
      alert("משתמש לא מחובר נא לבצע התחברות");
      router.push('/login');
    } else if (firstListingFree === true) {
      // Redirect to payment page if firstListingFree is false
      router.push('/payment');
    }
  }, []);



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setImages(selectedFiles);
    }
  };

  const fetchCities = async (searchTerm: string) => {
    try {
      const response = await fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=d4901968-dad3-4845-a9b0-a57d027f11ab`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.success && data.result && data.result.records) {
        const cityList: string[] = data.result.records
          .map((record: any) => record['שם_ישוב'])
          .filter((city: string) => city !== '' && city.toLowerCase().includes(searchTerm.toLowerCase()));
        setCities(cityList);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSelectedCity(searchTerm);
    if (searchTerm) {
      fetchCities(searchTerm);
    } else {
      setCities([]);
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCities([]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();


    if (Number(price) <= 0 || Number(rooms) <= 0) {
      setMessage('Price and Rooms must be positive numbers');
      return;
    }

    if (firstListingFree) {
      // Redirect to payment page if firstListingFree is true
      router.push('/payment');
      return;
    }

    const formData = new FormData();
    formData.append('neighborhood', neighborhood);
    formData.append('price', price);
    formData.append('rooms', rooms.toString());
    formData.append('city', selectedCity);
    formData.append('propertyType', propertyType);
    formData.append('userId', userId?.toString() || '');
    formData.append('parking', parking.toString()); // Add parking
    formData.append('warehouse', warehouse.toString()); // Add warehouse
    formData.append('elevator', elevator.toString()); // Add elevator
    formData.append('address', address); // Add address
    formData.append('contactSeller', contactSeller); // Add seller contact
    formData.append('floor', floor.toString()); // Add floor
    formData.append('hasBalcony', hasBalcony.toString()); // Add has balcony

    images.forEach((image) => {
      formData.append('images', image);
    });

    setIsLoading(true);
    try {
      const response = await fetch('/api/postProperty', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Property added successfully! Property ID: ${data.propertyId}`);
        resetForm();
        router.push('/');
        const userDetails = localStorage.getItem('user');
        if (userDetails) {
          const parsedUser = JSON.parse(userDetails);
          parsedUser.firstListingFree = true;
          localStorage.setItem('user', JSON.stringify(parsedUser));
        }
        setFirstListingFree(true); // עדכון ה-state הגלובלי

      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error submitting property');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNeighborhood('');
    setPrice('');
    setRooms('');
    setImages([]);
    setMessage('');
    setSelectedCity('');
    setPropertyType('Apartment');
    setParking(false); // Reset parking
    setWarehouse(false); // Reset warehouse
    setElevator(false); // Reset elevator
    setAddress(''); // Reset address
    setContactSeller(''); // Reset contact seller
    setFloor(''); // Reset floor
    setHasBalcony(false); // Reset hasBalcony

  };


  return (
    <div dir="rtl" className="bg-black bg-opacity-30 text-white p-8 rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gold-300">פרסום נכס</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Type Selection */}
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium mb-2 text-gold-300">סוג נכס</label>
          <select
            id="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="bg-black bg-opacity-70 text-white p-3 rounded-md w-full focus:outline-none focus:ring focus:ring-gold-300"
          >
            <option value="Apartment">דירה</option>
            <option value="Project">פרויקט קבלן</option>
            <option value="Land">קרקע</option>
            <option value="Business">בית עסק</option>
          </select>
        </div>
  
        {/* City Input */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-2 text-gold-300">עיר</label>
          <input
            type="text"
            id="city"
            value={selectedCity}
            onChange={handleCityChange}
            className="bg-black bg-opacity-70 text-white p-3 rounded-md w-full focus:outline-none focus:ring focus:ring-gold-300"
            placeholder="הקלד שם עיר"
          />
          {cities.length > 0 && (
            <ul className="absolute bg-gray-800 text-white border border-gray-600 w-full max-h-60 overflow-y-auto z-10 rounded-md mt-1">
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
  
        {/* Neighborhood Input */}
        <div>
          <label htmlFor="neighborhood" className="block text-sm font-medium mb-2 text-gold-300">שכונה/איזור</label>
          <input
            type="text"
            id="neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="bg-black bg-opacity-70 text-white p-3 rounded-md w-full focus:outline-none focus:ring focus:ring-gold-300"
            required
          />
        </div>
  
        {/* Price Input */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2 text-gold-300">מחיר</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-black bg-opacity-70 text-white p-3 rounded-md w-full focus:outline-none focus:ring focus:ring-gold-300"
            required
          />
        </div>
  
        {/* Rooms Input */}
        <div>
          <label htmlFor="rooms" className="block text-sm font-medium mb-2 text-gold-300">מספר חדרים</label>
          <input
            type="number"
            id="rooms"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className="bg-black bg-opacity-70 text-white p-3 rounded-md w-full focus:outline-none focus:ring focus:ring-gold-300"
            required
          />
        </div>
  
        {/* Floor Input */}
        <div>
          <label htmlFor="floor" className="block text-sm font-medium mb-2 text-gold-300">קומה</label>
          <input
            type="number"
            id="floor"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="bg-black bg-opacity-70 text-white p-3 rounded-md w-full focus:outline-none focus:ring focus:ring-gold-300"
          />
        </div>
  
        {/* Address Input */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-2 text-gold-300">כתובת</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-black bg-opacity-70 text-white p-3 rounded-md w-full focus:outline-none focus:ring focus:ring-gold-300"
          />
        </div>
  
        {/* Contact Seller Input */}
        <div>
          <label htmlFor="contactSeller" className="block text-sm font-medium mb-2 text-gold-300">דרכי יצירת קשר עם המוכר</label>
          <input
            type="text"
            id="contactSeller"
            value={contactSeller}
            onChange={(e) => setContactSeller(e.target.value)}
            className="bg-black bg-opacity-70 text-white p-3 rounded-md w-full focus:outline-none focus:ring focus:ring-gold-300"
          />
        </div>
  
        {/* Has Balcony Checkbox */}
        <div className="flex items-center mb-4">
          <label htmlFor="hasBalcony" className="text-gold-300">מרפסת</label>
          <input
            type="checkbox"
            id="hasBalcony"
            checked={hasBalcony}
            onChange={() => setHasBalcony(!hasBalcony)}
            className="ml-2 text-gold-300 focus:ring focus:ring-gold-300"
          />
        </div>
  
        {/* Parking Checkbox */}
        <div className="flex items-center mb-4">
          <label htmlFor="parking" className="text-gold-300">חניה</label>
          <input
            type="checkbox"
            id="parking"
            checked={parking}
            onChange={() => setParking(!parking)}
            className="ml-2 text-gold-300 focus:ring focus:ring-gold-300"
          />
        </div>
  
        {/* Warehouse Checkbox */}
        <div className="flex items-center mb-4">
          <label htmlFor="warehouse" className="text-gold-300">מחסן</label>
          <input
            type="checkbox"
            id="warehouse"
            checked={warehouse}
            onChange={() => setWarehouse(!warehouse)}
            className="ml-2 text-gold-300 focus:ring focus:ring-gold-300"
          />
        </div>
  
        {/* Elevator Checkbox */}
        <div className="flex items-center mb-4">
          <label htmlFor="elevator" className="text-gold-300">מעלית</label>
          <input
            type="checkbox"
            id="elevator"
            checked={elevator}
            onChange={() => setElevator(!elevator)}
            className="ml-2 text-gold-300 focus:ring focus:ring-gold-300"
          />
        </div>
  
        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium mb-2 text-gold-300">העלת תמונות מהנכס</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleFileChange}
            className="bg-black bg-opacity-70 text-white p-3 rounded-md w-full focus:outline-none focus:ring focus:ring-gold-300"
          />
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-blue-500 text-white py-2 rounded-md w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'הוסף נכס'}
        </button>
  
        {/* Error Message */}
        {message && <p className="text-red-500">{message}</p>}
      </form>
    </div>
  );
  }  
export default AddPropertyForm;