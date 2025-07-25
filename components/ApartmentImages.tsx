import { useState, useEffect } from 'react';

interface ApartmentImagesProps {
  property_id: number;
}

const ApartmentImages: React.FC<ApartmentImagesProps> = ({ property_id }) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ApartmentImages useEffect running, property_id:', property_id);
    const fetchImages = async () => {
      try {
        console.log('Fetching images from /api/apartmentsPictures with property_id:', property_id);
        const response = await fetch('/api/apartmentsPictures', {
          method: 'GET',
          headers: {
            'property_id': property_id.toString(),
          },
        });
        console.log('Fetch response status:', response.status, response.statusText);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();
        console.log('Data received from API:', data);
        setImages(data.images || []);
      } catch (err: any) {
        setError(`Error fetching images: ${err.message}`);
        console.error('Error fetching images:', err);
      }
    };
    if (property_id) {
      fetchImages();
    }
  }, [property_id]);

  // מעבר לתמונה הבאה
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // מעבר לתמונה הקודמת
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Add log for every image rendered
  if (images.length > 0) {
    console.log('Rendering image:', images[currentIndex]);
  }

  if (error) {
    return <div>Error loading images: {error}</div>;
  }

  return (
    <div className="relative w-full h-64 md:h-96">
      {images.length > 0 ? (
        <img
          src={images[currentIndex]}
          alt={`Apartment ${property_id} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <p>אין תמונות זמינות</p>
      )}

      {/* חץ לתמונה הקודמת */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-600 text-3xl md:text-4xl"
          >
            ◀
          </button>

          {/* חץ לתמונה הבאה */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-600 text-3xl md:text-4xl"
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
};

export default ApartmentImages;
