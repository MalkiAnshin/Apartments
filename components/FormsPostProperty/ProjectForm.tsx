import { useState } from 'react';

const ProjectForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
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




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    const target = e.target as HTMLFormElement;
    
    formData.append('city', (target.city as HTMLInputElement).value);
    formData.append('neighborhood', (target.neighborhood as HTMLInputElement).value);
    formData.append('price', (target.price as HTMLInputElement).value);
    formData.append('propertyType', 'Project');
    formData.append('userId', (target.userId as HTMLInputElement).value);
    formData.append('rooms', (target.rooms as HTMLInputElement).value);
    formData.append('isBuilt', (target.isBuilt as HTMLInputElement).checked ? 'true' : 'false');
    formData.append('contactSeller', (target.contactSeller as HTMLInputElement).value);
    formData.append('address', (target.address as HTMLInputElement).value);
    
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await fetch('/api/properties', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (response.ok) {
      alert('Project added successfully!');
    } else {
      alert('Error: ' + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-transparent p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-center text-gold-500 mb-6">Add Project</h2>

      <div className="space-y-4">
        <div className="flex flex-col relative">
          <label className="text-xl text-white">City</label>
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
          <label className="text-xl text-white">Neighborhood</label>
          <input type="text" name="neighborhood" required className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">Price</label>
          <input type="text" name="price" required className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">Rooms</label>
          <input type="text" name="rooms" required className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">Is Built</label>
          <input type="checkbox" name="isBuilt" className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">Contact Seller</label>
          <input type="text" name="contactSeller" required className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">Address</label>
          <input type="text" name="address" required className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <div className="flex flex-col">
          <label className="text-xl text-white">Images</label>
          <input type="file" multiple onChange={(e) => setImages(Array.from(e.target.files || []))} className="p-2 rounded border-2 border-gold-500 bg-transparent text-white" />
        </div>

        <button type="submit" className="bg-gold-500 text-black py-2 px-4 rounded-lg w-full hover:bg-gold-600">Submit</button>
      </div>
    </form>
  );
};

export default ProjectForm;
