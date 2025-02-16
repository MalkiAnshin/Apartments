import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContractModal from './ContractModal';
import ProjectImages from './ProjectImages';
import CitySelector from './CitySelector';
import Filters from './Filters';

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ minPrice?: number; maxPrice?: number; rooms?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [isContractChecked, setIsContractChecked] = useState(false); // מצב לבדיקת החוזה
  const [isLoading, setIsLoading] = useState(false); // מצב להמתנה עד שהחוזה ייבדק


  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser).userId : null;


  const router = useRouter();

  // Define setPriceFilter and setRoomsFilter functions to update the filters state
  const setPriceFilter = (price: { min: number; max: number }) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      minPrice: price.min,
      maxPrice: price.max,
    }));
  };

  const setRoomsFilter = (rooms: number) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      rooms: rooms.toString(),
    }));
  };

  // Fetch Projects when city or filters change
  useEffect(() => {
    const fetchProjects = async () => {
      const query = new URLSearchParams();
      if (selectedCity) query.append('city', selectedCity);
      if (filters.minPrice) query.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) query.append('maxPrice', filters.maxPrice.toString());
      if (filters.rooms) query.append('rooms', filters.rooms);

      try {
        const response = await fetch(`/api/projects?${query.toString()}`);
        if (!response.ok) throw new Error(`Failed to fetch data, status: ${response.status}`);
        const data = await response.json();
        setProjects(data);

      } catch (err) {
        console.error("Error fetching projects:", err);
        setError('Error fetching projects');
      }
    };

    if (selectedCity) fetchProjects();
  }, [selectedCity, filters]);

  const handleProjectClick = (project: any) => {
    if (!userId) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push('/login');
    }
    setIsLoading(true); // מתחילים את ההמתנה

    checkContract(project.property_id, "project");
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const checkContract = async (projectId: string, propertyType: string) => {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').userId || null;
    if (!userId) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/moreDetailsProjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, userId, propertyType }),
      });

      if (!response.ok) throw new Error(`Network response was not ok`);

      const data = await response.json();

      if (data.exists) {
        // אם החוזה קיים, אפשר להציג את המידע המלא
        setSelectedProject(prev => ({
          ...prev,
          moreDetails: true, // לדוגמה, פשוט מסמן שהמידע המלא זמין
        }));
        (prev => ({ ...prev, moreDetails: data.details }));
      } else {
        // If contract doesn't exist (false), show the modal
        setShowModal(true);
      }
      setIsContractChecked(true);
      setIsLoading(false); // סיימנו את ההמתנה

    } catch (err) {
      setError(`Error checking contract: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
      setIsLoading(false);

    }
  };

  return (
    <div className="text-white min-h-screen flex flex-col items-center p-6 rtl">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">מצא את דירת הפרויקט המתאימה</h1>

        {/* City Selector Component */}
        <CitySelector onCitySelect={setSelectedCity} />

        {/* Display Filters and Apartments only if a city is selected */}
        {selectedCity && (
          <>
            <Filters
              onPriceChange={setPriceFilter}
              onRoomsChange={setRoomsFilter}
            />
            <h2 className="text-2xl font-semibold mb-4 text-gold text-center">דירות פרויקט ב{selectedCity}</h2>
            {projects.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(project => (
                  <li
                    key={project.property_id}
                    className="bg-gray-800 p-4 rounded-lg border border-gold cursor-pointer rtl"
                  >
                    <p className="text-lg font-medium">שכונה/איזור: {project.neighborhood}</p>
                    <p className="text-md text-gold">מחיר: {project.price} ש"ח</p>
                    <p className="text-sm">חדרים: {project.rooms}</p>
                    <ProjectImages property_id={project.property_id} />
                    <button
                      className="mt-4 bg-gold text-black px-6 py-2 rounded-md font-semibold"
                      onClick={() => handleProjectClick(project)}
                      disabled={isLoading} // Disable the button while checking
                    >
                      {isLoading ? "בודק..." : "פרטים נוספים"}
                    </button>

                    {/* Only show additional details if contract has been checked */}
                    {isContractChecked && selectedProject?.property_id === project.property_id && !showModal && (
                      <div className="mt-4 text-gold">
                        <p>כתובת: {project.address}</p>
                        <p>פרטי יצירת קשר: {project.contact_seller}</p>
                        {/* Add more fields as needed */}
                      </div>
                    )}
                    {showModal && selectedProject?.property_id === project.property_id && (
                      <ContractModal
                        selectedProperty={selectedProject}
                        property_type="project"
                        onClose={handleCloseModal}
                      />
                    )}

                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-xl text-gray-400 mt-4">לא נמצאו פרויקט מתאים.</p>
            )}
          </>
        )}
      </div>
      {error && <div className="text-red-600 text-center mt-4">{error}</div>}
    </div>
  );
};

export default ProjectsList;
