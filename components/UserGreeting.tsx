import React from 'react';
import { useGlobalContext } from '../app/context/GlobalContext'; // Make sure the path is correct

const UserGreeting: React.FC = () => {
  const { user } = useGlobalContext(); // Ensure the function exists

  // לוגים לבדוק מהו הערך של user
  console.log('UserGreeting - Current user:', user);

  return (
    <div className="text-center">
      {user ? (
        <p className="text-lg font-bold text-black">{user}</p> // בולט יותר
      ) : (
        <p>
          אין לך חשבון? <a href="/login" className="text-black">התחבר כאן</a>
        </p>
      )}
    </div>
  );
};

export default UserGreeting;
