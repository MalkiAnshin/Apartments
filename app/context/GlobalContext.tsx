'use client';

import React, { createContext, useContext, useState } from 'react';

// הגדרת טיפוס המשתמש
export type UserType = 'user' | 'admin' | null;


// הגדרת טיפוס הקונטקסט הגלובלי
interface GlobalContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  userType: UserType;
  setUserType: (type: UserType) => void;

  userId: number | null; // Change to number
  setUserId: (user: number | null) => void;

  firstListingFree: boolean | null; // Allow null
  setFirstListingFree: (user: boolean | null) => void;
}


// יצירת הקונטקסט הגלובלי
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// ספק קונטקסט
export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [firstListingFree, setFirstListingFree] = useState<boolean>(null);


  return (
    <GlobalContext.Provider value={{ user, setUser, userType, setUserType, userId, setUserId, firstListingFree, setFirstListingFree }}>
      {children}
    </GlobalContext.Provider>
  );
};

// פונקציה להוצאת הקונטקסט
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};