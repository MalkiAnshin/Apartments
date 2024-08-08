import React, { useState } from 'react';

const PostPage: React.FC = () => {
  const [propertyDetails, setPropertyDetails] = useState({
    address: '',
    price: '',
    description: '',
    // שדות נוספים
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // שליחת הנתונים לשרת
  };

  return (
    <div>
      <h1>Post a Property</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Address"
          value={propertyDetails.address}
          onChange={(e) => setPropertyDetails({ ...propertyDetails, address: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={propertyDetails.price}
          onChange={(e) => setPropertyDetails({ ...propertyDetails, price: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={propertyDetails.description}
          onChange={(e) => setPropertyDetails({ ...propertyDetails, description: e.target.value })}
        />
        {/* שדות נוספים */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostPage;
