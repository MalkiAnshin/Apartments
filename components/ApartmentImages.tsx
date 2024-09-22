import { useState, useEffect } from 'react';

const ApartmentImages = ({ property_id }: { property_id: number }) => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      console.log(1111);
      
      try {
        const response = await fetch(`/api/apartmentsPictures?id=${property_id}`);
        
        console.log('API response status:', response.status);
        console.log('API response headers:', response.headers);
    

        if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Data received from API:', data);
        setImages(data.images);
      } catch (err: any) {
        setError(`Error fetching images: ${err.message}`);
        console.error('Error fetching images:', err);
      }
    };
  
    fetchImages();
  }, [property_id]);
  
  if (error) {
    return <div>Error loading images: {error}</div>;
  }

  return (
    <div className="flex gap-2">
      {images.map((imageUrl, index) => (
        <img key={index} src={imageUrl} alt={`Apartment ${property_id} - Image ${index}`} className="w-32 h-32 object-cover" />
      ))}
    </div>
  );
};

export default ApartmentImages;
