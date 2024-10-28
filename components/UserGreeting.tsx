// components/UserGreeting.tsx

import React from 'react';
import { useGlobalContext } from '../app/context/GlobalContext'; // ודא שהנתיב נכון

const UserGreeting: React.FC = () => {
  const { user } = useGlobalContext(); // מוודאים שהפונקציה קיימת

  return (
    <div className="text-center">
      {user ? (
        <p>!{user} ברוך הבא </p>
      ) : (
        <p>
          אין לך חשבון? <a href="/login" className="text-black">התחבר כאן</a>
        </p>
      )}
    </div>
  );
};

export default UserGreeting;
