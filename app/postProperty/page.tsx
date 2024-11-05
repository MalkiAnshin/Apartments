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

    console.log(`user id :::::::::::::::::::${userId}`)

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
    <div className="bg-gray-800 text-white p-6 rounded-md relative">
      <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Property Type Selection */}
        <div>
          <label htmlFor="propertyType" className="block mb-2">Property Type</label>
          <select
            id="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="bg-gray-700 p-2 rounded-md w-full"
          >
            <option value="Apartment">Apartment</option>
            <option value="Project">Project</option>
            <option value="Land">Land</option>
            <option value="Business">Business</option>
          </select>
        </div>

        {/* City Input */}
        <div>
          <label htmlFor="city" className="block mb-2">City</label>
          <input
            type="text"
            id="city"
            value={selectedCity}
            onChange={handleCityChange}
            className="bg-gray-700 p-2 rounded-md w-full"
            placeholder="Choose a city"
          />
          {cities.length > 0 && (
            <ul className="absolute bg-gray-600 text-white border border-gray-500 w-full max-h-60 overflow-y-auto z-10">
              {cities.map((city) => (
                <li
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="cursor-pointer hover:bg-gray-500 p-2"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Neighborhood Input */}
        <div>
          <label htmlFor="neighborhood" className="block mb-2">Neighborhood</label>
          <input
            type="text"
            id="neighborhood"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="bg-gray-700 p-2 rounded-md w-full"
            required
          />
        </div>

        {/* Price Input */}
        <div>
          <label htmlFor="price" className="block mb-2">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-gray-700 p-2 rounded-md w-full"
            required
          />
        </div>

        {/* Rooms Input */}
        <div>
          <label htmlFor="rooms" className="block mb-2">Rooms</label>
          <input
            type="number"
            id="rooms"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className="bg-gray-700 p-2 rounded-md w-full"
            required
          />
        </div>

        {/* Floor Input */}
        <div>
          <label htmlFor="floor" className="block mb-2">Floor</label>
          <input
            type="number"
            id="floor"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="bg-gray-700 p-2 rounded-md w-full"
          />
        </div>

        {/* Has Balcony Checkbox */}
        <div>
          <label htmlFor="hasBalcony" className="flex items-center mb-2">
            <input
              type="checkbox"
              id="hasBalcony"
              checked={hasBalcony}
              onChange={() => setHasBalcony(!hasBalcony)}
              className="mr-2"
            />
            Has Balcony
          </label>
        </div>


        {/* Address Input */}
        <div>
          <label htmlFor="address" className="block mb-2">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-gray-700 p-2 rounded-md w-full"
          />
        </div>

        {/* Contact Seller Input */}
        <div>
          <label htmlFor="contactSeller" className="block mb-2">Contact Seller</label>
          <input
            type="text"
            id="contactSeller"
            value={contactSeller}
            onChange={(e) => setContactSeller(e.target.value)}
            className="bg-gray-700 p-2 rounded-md w-full"
          />
        </div>

        {/* Parking Checkbox */}
        <div>
          <label htmlFor="parking" className="flex items-center mb-2">
            <input
              type="checkbox"
              id="parking"
              checked={parking}
              onChange={() => setParking(!parking)}
              className="mr-2"
            />
            Parking
          </label>
        </div>

        {/* Warehouse Checkbox */}
        <div>
          <label htmlFor="warehouse" className="flex items-center mb-2">
            <input
              type="checkbox"
              id="warehouse"
              checked={warehouse}
              onChange={() => setWarehouse(!warehouse)}
              className="mr-2"
            />
            Warehouse
          </label>
        </div>

        {/* Elevator Checkbox */}
        <div>
          <label htmlFor="elevator" className="flex items-center mb-2">
            <input
              type="checkbox"
              id="elevator"
              checked={elevator}
              onChange={() => setElevator(!elevator)}
              className="mr-2"
            />
            Elevator
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block mb-2">Upload Images</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleFileChange}
            className="bg-gray-700 p-2 rounded-md w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-blue-500 text-white py-2 rounded-md w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Add Property'}
        </button>

        {/* Error Message */}
        {message && <p className="text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default AddPropertyForm;
