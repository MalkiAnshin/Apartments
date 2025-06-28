'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContractModal from './ContractModal';
import ApartmentImages from './ApartmentImages';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const RandomApartmentsCarousel: React.FC = () => {
  const [apartments, setApartments] = useState<any[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const userId = storedUser ? JSON.parse(storedUser).userId : null;
  const router = useRouter();

  useEffect(() => {
    const fetchApartments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/apartments');
        if (!response.ok) throw new Error(`Failed to fetch data, status: ${response.status}`);
        const data = await response.json();
        setApartments(data);
      } catch (err) {
        console.error('Error fetching apartments:', err);
        setError('שגיאה בטעינת הדירות, נסה שוב מאוחר יותר');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApartments();
  }, []);

  const handleApartmentClick = async (apartment: any) => {
    if (!userId) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/moreDetailsApartments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apartmentId: apartment.property_id, userId, propertyType: 'apartment' }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      if (data.exists) {
        alert(`החוזה עבור דירה זו כבר חתום.\nכתובת: ${apartment.address}\nפרטי יצירת קשר: ${apartment.contact_seller}`);
      } else {
        setSelectedApartment(apartment);
      }
    } catch (error) {
      console.error('Error checking contract:', error);
      setError('שגיאה בבדיקת החוזה. נסה שוב מאוחר יותר.');
    }
  };

  const handleCloseModal = () => {
    setSelectedApartment(null);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  return (
    <div className="text-white min-h-screen flex flex-col items-center p-6 rtl">
      {isLoading ? (
        <p className="text-center text-xl text-gray-400 mt-4">טוען דירות...</p>
      ) : error ? (
        <div className="text-red-600 text-center mt-4">{error}</div>
      ) : apartments.length > 0 ? (
        <Slider {...sliderSettings} className="w-full max-w-5xl">
          {apartments.map(apartment => (
            <div key={apartment.property_id} className="p-4 relative">
              <div className="bg-gray-800 p-4 rounded-lg border border-gold">
                <p className="text-lg font-medium">עיר: {apartment.city}</p>
                <p className="text-lg font-medium">שכונה: {apartment.neighborhood}</p>
                <p className="text-md text-gold">
                  מחיר: {Number(apartment.price).toLocaleString('he-IL', { maximumFractionDigits: 0 })} ש"ח
                </p>
                <p className="text-sm">חדרים: {apartment.rooms}</p>
                <ApartmentImages property_id={apartment.property_id} />

                <button className="mt-4 bg-gold text-black px-6 py-2 rounded-md font-semibold" onClick={() => handleApartmentClick(apartment)}>
                  פרטים נוספים
                </button>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-xl text-gray-400 mt-4">לא נמצאו דירות.</p>
      )}

      {selectedApartment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <ContractModal selectedProperty={selectedApartment} property_type="apartment" onClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
};

export default RandomApartmentsCarousel;
