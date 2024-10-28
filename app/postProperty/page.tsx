'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddPropertyForm: React.FC = () => {
  const [neighborhood, setNeighborhood] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [rooms, setRooms] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>(''); // State for the selected city
  const [cities, setCities] = useState<string[]>([]); // Cities retrieved from the API
  const [filteredCities, setFilteredCities] = useState<string[]>([]); // Cities based on search
  const [propertyType, setPropertyType] = useState<string>('Apartment'); // Default property type
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  // API call to fetch cities based on the search
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
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  // Any change in the city field will trigger an API call
  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.trim().replace(/\s+/g, ' '); // Trim unnecessary spaces
    setSelectedCity(searchTerm); // Update selected city
    fetchCities(searchTerm); // Call API
  };
  
  const handleCitySelect = (city: string) => {
    setSelectedCity(city); // When the user selects a city, update the input
    setCities([]); // Close the list after selection
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('neighborhood', neighborhood);
    formData.append('price', price);
    formData.append('rooms', rooms);
    formData.append('city', selectedCity); // Add the city to the form data
    formData.append('propertyType', propertyType); // Add property type to the form data

    // Append image files to FormData
    images.forEach((image) => {
      formData.append('images', image);
    });

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
    }
  };

  const resetForm = () => {
    setNeighborhood('');
    setPrice('');
    setRooms('');
    setImages([]);
    setMessage('');
    setSelectedCity(''); // Reset the city
    setPropertyType('Apartment'); // Reset the property type to default
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
          {/* Display list of cities */}
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
            type="text"
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
            type="text"
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
        >
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default AddPropertyForm;
