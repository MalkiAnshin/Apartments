'use client';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import ApartmentImages from './ApartmentImages'; // יבוא של הקומפוננטה

interface Apartment {
    id: number;
    property_id: number;
    images: string[]; // התמונות שיגיעו מ-API
    price: number;
    city: string;
    neighborhood: string;
    rooms: number;
}

const RandomApartmentsCarousel: React.FC = () => {
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRandomApartments = async () => {
            try {
                const response = await fetch('/api/random-apartments');
                if (!response.ok) {
                    throw new Error('Error fetching random apartments');
                }
                const data = await response.json();
                setApartments(data);
            } catch (error) {
                setError('Failed to load apartments.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRandomApartments();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
    };

    if (loading) {
        return <div className="text-center text-gray-500">Loading apartments...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="pt-16 mb-16">
            <h2 className="text-center text-3xl font-bold mb-6 text-gray-50 tracking-wide">
                דירות למכירה באתר
            </h2>
            <Slider {...settings}>
                {apartments.map((apartment) => (
                    <div key={apartment.property_id} className="px-4">
                        <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col transform hover:scale-105 transition-all duration-300 ease-in-out">
                            {/* קריאה לקומפוננטה ApartmentImages */}
                            <ApartmentImages property_id={apartment.property_id} />
                            
                            {/* פרטי הדירה */}
                            <div className="p-4">
                                <p className="text-lg font-semibold text-gray-800">{`חדרים: ${apartment.rooms}`}</p>
                                <p className="text-sm text-gray-600">{`שכונת ${apartment.neighborhood}`}</p>
                                <p className="text-sm text-gray-600">{`עיר: ${apartment.city}`}</p>
                                <p className="text-xl font-bold text-yellow-700 mt-3">{`₪${apartment.price.toLocaleString()}`}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default RandomApartmentsCarousel;
