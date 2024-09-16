'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PostProperty: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [canPost, setCanPost] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // בדוק אם המשתמש מחובר
        const authResponse = await fetch('/api/check-auth'); // החלף עם נקודת הקצה שלך לבדוק אם המשתמש מחובר
        const authData = await authResponse.json();

        if (!authData.isAuthenticated) {
          // הפנה לדף ההתחברות אם לא מחובר
          router.push('/login');
          return;
        }

        setIsLoggedIn(true);

        // בדוק אם המשתמש המחובר כבר פרסם מודעה
        const listingsResponse = await fetch('/api/check-listings'); // API לבדוק את פרסום המשתמש
        const listingsData = await listingsResponse.json();
        setCanPost(listingsData.canPost);
      } catch (error) {
        console.error('שגיאה בבדיקת סטטוס המשתמש:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [router]);

  if (loading) {
    return <p>טוען...</p>;
  }

  if (!isLoggedIn) {
    return null; // ההפניה תטפל בזה
  }

  if (!canPost) {
    return (
      <div className="bg-black text-gold p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">לא ניתן לפרסם דירה נוספת</h2>
        <p>
          כבר פרסמת דירה אחת בחינם. ליצירת קשר עם המנהל לאישור פרסום נוסף, אנא פנה אלינו באמצעות פרטי יצירת הקשר באתר.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black text-gold p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">פרסם דירה</h2>
      <form method="POST" action="/api/postProperty">
        <div className="mb-4">
          <label className="block text-lg">שם הדירה</label>
          <input type="text" name="name" className="w-full p-2 rounded-lg bg-gray-800 text-gold" required />
        </div>
        <div className="mb-4">
          <label className="block text-lg">עיר</label>
          <input type="text" name="city" className="w-full p-2 rounded-lg bg-gray-800 text-gold" required />
        </div>
        {/* שדות נוספים */}
        <button type="submit" className="bg-gold text-black px-4 py-2 rounded-lg">שלח</button>
      </form>
    </div>
  );
};

export default PostProperty;
