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
  const router = useRouter();

  const { user, userType } = useGlobalContext();

  useEffect(() => {
    if (!user) {
      alert("משתמש לא מחובר נא לבצע התחברות");
      router.push('/login');
    }
  }, [user, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      // Validate file types and sizes if necessary
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
    const searchTerm = event.target.value; // Remove trim to allow spaces
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

    const formData = new FormData();
    formData.append('neighborhood', neighborhood);
    formData.append('price', price);
    formData.append('rooms', rooms.toString());
    formData.append('city', selectedCity);
    formData.append('propertyType', propertyType);
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

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block mb-2">Images</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleFileChange}
            className="bg-gray-700 p-2 rounded-md w-full"
            required
          />
        </div>

        {/* Message Display */}
        {message && <p className="text-red-400">{message}</p>}

        <button
          type="submit"
          className="bg-gold-500 hover:bg-gold-700 text-white font-semibold py-2 px-4 rounded-md"
          disabled={isLoading} // Disable while loading
        >
          {isLoading ? 'Submitting...' : 'Submit Property'}
        </button>
      </form>
    </div>
  );
};

export default AddPropertyForm;
