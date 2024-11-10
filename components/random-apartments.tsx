'use client';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import ApartmentImages from './ApartmentImages';

interface Apartment {
    id: number;
    property_id: number;
    images: string[];
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
        return <div className="text-center">Loading apartments...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="mt-8 mb-16 min-h-[300px]">
            <h2 className="text-center text-2xl font-semibold mb-4 text-gray-700">דירות אקראיות</h2>
            <Slider {...settings}>
                {apartments.map((apartment) => (
                    <div key={apartment.id} className="px-1">
                        <div className="bg-white bg-opacity-50 text-gray-800 p-3 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out max-w-xs mx-auto">
                            {/* הגדרת מקום לתמונה מתוך הכרטיס */}
                            <div className="relative w-full h-40 mb-4 overflow-hidden">
                                <ApartmentImages property_id={apartment.property_id} />
                            </div>
                            <div className="mb-2">
                                <p className="text-lg font-semibold">{`חדרים${apartment.rooms}`}</p>
                                <p className="text-lg font-semibold">{`שכונת ${apartment.neighborhood}`}</p>
                                <p className="text-sm text-gray-600">{`עיר ${apartment.city}`}</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold mt-2 text-gray-800">{`₪${apartment.price}`}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default RandomApartmentsCarousel;
