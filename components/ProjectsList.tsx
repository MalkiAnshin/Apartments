import React, { useEffect, useState } from 'react';
import ContractModal from './ContractModal'; // Import the ContractModal component

const ProjectsList: React.FC = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=d4901968-dad3-4845-a9b0-a57d027f11ab');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.success && data.result && data.result.records) {
          const cityList: string[] = data.result.records
            .map((record: any) => record['שם_ישוב'])
            .filter((city: string) => city !== '');
          setCities(cityList);
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError('Error fetching cities: ' + err.message);
        } else {
          setError('An unknown error occurred');
        }
        console.error('Error fetching cities:', err);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    setFilteredCities(cities.filter((city: string) => city.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, cities]);

  useEffect(() => {
    console.log("use effect selectedCity", selectedCity);
    if (selectedCity) {
      const fetchProjects = async () => {
        try {
          console.log(`Fetching projects for city: ${selectedCity}`); // Log before API call
          const response = await fetch(`/api/projects?city=${selectedCity}`);
          console.log(`Response status: ${response.status}`); // Log response status

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Network response was not ok. Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
          }
          const data = await response.json();
          console.log('Fetched projects:', data); // Log fetched data

          if (Array.isArray(data)) {
            setProjects(data);
            console.log('Updated projects state:', data); // Log updated state
          } else {
            throw new Error('Unexpected data format');
          }
        } catch (err) {
          if (err instanceof Error) {
            setError('Error fetching projects: ' + err.message);
          } else {
            setError('An unknown error occurred');
          }
          console.error('Error fetching projects:', err);
        }
      };

      fetchProjects();
    }
  }, [selectedCity]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    const str = event.target.value.toLowerCase();
    setFilteredCities(cities.filter((city: string) => city.toLowerCase().includes(str)));
  };

  const handleCitySelect = (city: string) => {
    console.log('Selected city before update:', selectedCity); // Log before state update
    setSelectedCity(city);
    console.log('Selected city after update:', city); // Log after state update
    setSearchTerm('');
    console.log('Search term after update:', ''); // Log search term update
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal. Selected project:', selectedProject); // Log selected project before closing modal
    setShowModal(false);
    console.log('Modal state after closing:', showModal); // Log modal state after closing
    setSelectedProject(null);
  };

  console.log(projects); // Log projects state

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">מצא את הפרויקט המתאים</h1>
        {error && <div className="text-red-600 mb-4 text-center">Error: {error}</div>}
        <div className="mb-4">
          <label htmlFor="city-search" className="block text-lg font-semibold mb-2 text-center">בחר עיר:</label>
          <input
            id="city-search"
            type="text"
            placeholder="Type city name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-gray-800 text-white border border-gold rounded-md px-4 py-2 w-full"
          />
          {searchTerm && (
            <ul className="mt-2 bg-gray-800 border border-gold rounded-md">
              {filteredCities.map((city: string, index: number) => (
                <li
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedCity && (
          <h2 className="text-2xl font-semibold mb-4 text-gold text-center">
            פרויקטים ב{selectedCity}
          </h2>
        )}
        {projects.length > 0 ? (
          <ul className="space-y-4">
            {projects.map((project, index) => (
              <li
                key={project.property_id}
                className="bg-gray-800 p-4 rounded-lg border border-gold cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <p className="text-lg font-medium">שכונה/איזור: {project.neighborhood}</p>
                <p className="text-md text-gold">מחיר: {project.price} ש"ח</p>
                <p className="text-sm">חדרים: {project.rooms}</p>
              </li>
            ))}
          </ul>
        ) : (
          selectedCity && <p className="text-gray-400 text-center">No projects found for this city.</p>
        )}

        {showModal && selectedProject && (
          <ContractModal
            selectedProperty={selectedProject}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
