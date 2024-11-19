// components/ContactForm.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ContactForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter(); // הוספת router לשימוש בניתוב

  // useEffect(() => {
  //   // Fetch user ID from localStorage
  //   const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  //   setUserId(storedUser.userId || null);
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!userId) {
    //   setStatus('error');
    //   console.error('User ID not found');
    //   return;
    // }

    const formData = { username, email, message };

    try {
      const response = await fetch('/api/contactForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setStatus('success');
      setUsername('');
      setEmail('');
      setMessage('');
      console.log('Message sent successfully!');
      // לאחר שההודעה נשלחה בהצלחה, ניתוב לעמוד הבית
      router.push('/');
    } catch (error) {
      setStatus('error');
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg text-white mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-gold">צור קשר</h2>
      <p className="text-center text-gray-300 mb-6">
        אם ברצונך ליצור קשר ישיר, שלח מייל ל: <a href="mailto:admin@example.com" className="text-gold hover:underline">admin@example.com</a>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-gold">שם משתמש</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gold"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gold">אימייל</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gold"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-gold">הודעה</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gold"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gold text-black p-2 rounded font-semibold hover:bg-yellow-500 transition"
        >
          שלח הודעה
        </button>
        {status === 'success' && <p className="text-green-500 text-center mt-4">הודעה נשלחה בהצלחה!</p>}
        {status === 'error' && <p className="text-red-500 text-center mt-4">אירעה שגיאה, נסה שוב.</p>}
      </form>
    </div>
  );
};

export default ContactForm;
