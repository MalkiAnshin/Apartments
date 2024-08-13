'use client'

import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // שליחת הנתונים למערכת דוא"ל
  };

  return (
    <div>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={contactInfo.name}
          onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={contactInfo.email}
          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
        />
        <textarea
          placeholder="Message"
          value={contactInfo.message}
          onChange={(e) => setContactInfo({ ...contactInfo, message: e.target.value })}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ContactPage;
