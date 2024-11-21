'use client';

import React, { useEffect, useState } from 'react';

const ShowUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/AdminInterface/ShowUsers');
      if (!response.ok) {
        throw new Error('תגובה מהשרת לא הייתה תקינה');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('שגיאה בזמן Fetch המשתמשים: ' + (err instanceof Error ? err.message : 'אירעה שגיאה לא ידועה'));
      console.error('שגיאה בזמן Fetch המשתמשים:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-transparent text-white min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gold text-center">רשימת משתמשים</h1>
        {error && <div className="text-red-600 mb-4 text-center">שגיאה: {error}</div>}

        {users.length > 0 ? (
          <table className="min-w-full bg-transparent border border-gold mb-6">
            <thead>
              <tr className="border-b border-gold">
                <th className="text-left p-4">סוג משתמש</th>
                <th className="text-left p-4">תפקיד</th>
                <th className="text-left p-4">אימייל</th>
                <th className="text-left p-4">שם משתמש</th>
                <th className="text-left p-4">מזהה משתמש</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id} className="border-b border-gold">
                  <td className="p-4">{user.user_type}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.identity_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400 text-center">...טוען</p>
        )}
      </div>
    </div>
  );
};

export default ShowUsers;
