'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const PaymentPage: React.FC = () => {
    const [showDetails, setShowDetails] = useState(false);
    const router = useRouter();

    const handlePayment = () => {
        setShowDetails(true);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 text-white p-8 rounded-md shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">תשלום עבור פרסום נכס</h2>
                <p className="mb-4 text-center">נכס ראשון חינם, כבר פרסמת נכס אחד</p>
                <p className="mb-4 text-center">עליך לשלם כדי להוסיף נכס חדש.</p>
                <button
                    onClick={handlePayment}
                    className="w-full bg-gold-500 hover:bg-gold-700 text-white font-semibold py-2 rounded-md transition duration-300"
                >
                    בצע תשלום
                </button>
                {showDetails && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2 text-center">פרטי יצירת קשר:</h3>
                        <p className="text-center">טלפון: 050-1234567</p>
                        <p className="text-center">אימייל: Y@example.com</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;
