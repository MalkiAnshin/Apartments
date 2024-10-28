'use client'

// context/UserContext.tsx
import React, { createContext, useContext, useState } from 'react';

// צור את ה-Context
const UserContext = createContext(null);

// צור את ה-Provisioner
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // הגדרת ה-state הגלובלי

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// פונקציה להחזרת המשתמש מה-Context
export const useUser = () => {
  return useContext(UserContext);
};
