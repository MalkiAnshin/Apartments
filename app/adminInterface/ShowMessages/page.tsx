'use client'
import React, { useEffect, useState } from 'react';

const ShowMessages: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [error, setError] = useState<string>('')

    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/AdminInterface/ShowMessages');
            if (!response.ok) {
                throw new Error('תגובה מהשרת לא הייתה תקינה');
            }
            const data = await response.json();
            setMessages(data);
        } catch (err) {
            if (err instanceof Error) {
                setError('שגיאה בזמן Fetch המשתמשים: ' + err.message);
            } else {
                setError('אירעה שגיאה לא ידועה');
            }
            console.error('שגיאה בזמן Fetch המשתמשים:', err);
        }
    };

    const deleteMessage = async (messageId: string) => {
        try {
            const response = await fetch('/api/AdminInterface/ShowMessages', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messageId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete message');
            }

            // Remove the message from the UI immediately after deletion
            setMessages(messages.filter((message) => message.message_id !== messageId));
        } catch (err) {
            console.error('Error deleting message:', err);
            setError('Error deleting message: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div className="bg-black text-white min-h-screen flex flex-col items-center p-6">
            <div className="w-full max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gold text-center">הודעות למערכת</h1>
                {error && <div className="text-red-600 mb-4 text-center">שגיאה: {error}</div>}
                {messages.length > 0 ? (
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full bg-gray-800 border border-gold table-auto">
                            <thead>
                                <tr className="border-b border-gold">
                                    <th className="text-left p-4 text-sm md:text-base">מזהה משתמש</th>
                                    <th className="text-left p-4 text-sm md:text-base">שם משתמש</th>
                                    <th className="text-left p-4 text-sm md:text-base">אימייל</th>
                                    <th className="text-left p-4 text-sm md:text-base">תאריך</th>
                                    <th className="text-left p-4 text-sm md:text-base">הודעה</th>
                                    <th className="text-left p-4 text-sm md:text-base">פעולות</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map((message) => (
                                    <tr key={message.contact_id || 'default-key'} className="border-b border-gold">

                                        <td className="p-4 text-xs md:text-sm">{message.user_id}</td>
                                        <td className="p-4 text-xs md:text-sm">{message.username}</td>
                                        <td className="p-4 text-xs md:text-sm">{message.email}</td>
                                        <td className="p-4 text-xs md:text-sm">{message.contact_date}</td>
                                        <td className="p-4 text-xs md:text-sm">{message.message_body}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => deleteMessage(message.message_id)}
                                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-xs md:text-sm"
                                            >
                                                מחק
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-400 text-center">...טוען</p>
                )}
            </div>
        </div>
    );
};

export default ShowMessages;
