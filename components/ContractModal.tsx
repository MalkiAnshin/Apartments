import React, { useState, useRef } from 'react';
import SignaturePad from 'react-signature-canvas';

const ContractModal: React.FC<{ selectedProperty: any, onClose: () => void }> = ({ selectedProperty, onClose }) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [id, setId] = useState<Number>();
  const [idCardImage, setIdCardImage] = useState<File | null>(null);

  // Ref to access SignaturePad instance
  const signaturePadRef = useRef<SignaturePad>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignatureSave = async () => {
    if (!signature || !name || !date) {
      alert('Please complete all fields.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('propertyId', selectedProperty.property_id);
      formData.append('signature', signature);
      formData.append('name', name);
      formData.append('date', date);
      formData.append('comments', comments);
      if (idCardImage) {
        formData.append('idCardImage', idCardImage);
      }

      const response = await fetch('/api/sign-contract', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Contract signed successfully!');
        onClose();
      } else {
        throw new Error('Failed to sign contract');
      }
    } catch (error) {
      console.error('Error signing contract:', error);
    }
  };

  const handleSaveSignature = () => {
    if (signaturePadRef.current) {
      setSignature(signaturePadRef.current.toDataURL());
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setIdCardImage(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-3xl max-h-[90%] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">חתום על החוזה</h2>
        <p className="text-base mb-2">טופס הזמנת שירותי תיווך בלעדיים למכירת/השכרת נכס מקרקעין 0014</p>
        <p className="text-sm mb-2">(בהתאם ל"חוק המתווכים במקרקעין, התשנ"ז 1996")</p>

        {/* סעיפים לחוזה */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">סעיפים:</h3>
          <ul className="list-disc list-inside pl-4">
            <li>הלקוח מזמין מהמתווח שירותי תיווך מקרקעין, כדי לקבל שירותי תיווך בקשר לנכסים המפורטים להלן עבורנו ועבור (להלן "שולחו")</li>
            <li>הלקוחות מאשרים כי המתווך הציג בפניהם את הנכסים המפורטים להלן, והם מתחייבים לדווח ל "שילת נכסים" מיד על משא ומתן המתנהל עמם בקשר לאחד או יותר מהנכסים, וכן מיד עם חתימת הסכם מחייב ו/או עם התחייבות לביצוע העסקה, המוקדם ביניהם, ביחס לאחד או יותר מהנכסים להלן</li>
            <li>הלקוחות מתחייבים לשלם ל "שילת נכסים" דמי תיווך בשיעור המפורט להלן בסעיף 5 מיד עם חתימת הסכם מחייב ו/או עם התחייבות לביצוע העסקה, המוקדם ביניהם, בנוגע לאחד או יותר מהנכסים המפורטים להלן, עמנו או עם מי מטעמנו, או עם כל גוף שאנו או מי מיטעמנו קשור אליו, או עם כל מי שמסרנו פרטים בקשר לנכסים</li>
            <li>הקונים מתחייבים לא למסור לגורם כלשהוא מידע שיקבלו מ "שילת נכסים" בנוגע לנכסים שלהלן, והם מתחייבים לפצות את "שילת נכסים" על כל נזק שיגרם להם באם יפרו התחייבות זו.</li>
            <li>דמי התיווך ישולמו ל "שילת נכסים" כמפורט בסעיף 3 לעיל ויהיו כדלקמן:
              <ul className="list-disc list-inside pl-4">
                <li>בקניה: 2% בתוספת מע"מ ממחיר המכירה הכולל של הנכס אך לא פחות מ- 10,000 ₪ בתוספת מע"מ.</li>
                <li>בשכירות: דמי שכירות של חודש אחד בתוספת מע"מ.</li>
                <li>האמור לעיל בא בנוסף לזכותה של שילת אורם – "שילת נכסים" לנכות דמי תיווך מהמוכר/משכיר.</li>
                <li>כאמור דמי התיווך ישולמו מיד עם חתימת הסכם מחייב ו/או עם התחייבות לביצוע העסקה המוקדם מבניהם. כל תשלום אשר לא יעשה בתוך שלושה ימים ממועד זה ישא הצמדה וריבית כנהוג בחשבונות עו"ש מהיום לתשלום ועד יום פירעון התשלום בפועל.</li>
                <li>הלקוח מצהיר כי ידוע לו שדמי התיווך יגבו על ידי "בת שבע נדל"ן" וכנגד חשבוניות מס כחוק מטעם "שילת נכסים".</li>
              </ul>
            </li>
            <li>הלקוח מאשר שהומלץ לו ע"י המתווך להסתייע בשירותי עורך דין ו/או מומחים אחראים לפי הענין והצורך במהלך העסקה.</li>
          </ul>
        </div>

        {/* שדות הזנת הנתונים */}
        <p className="mb-4">בתאריך: <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-gray-200 border border-gray-300 rounded-md px-4 py-2 w-full" /></p>

        <p className="mb-4">שם: <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-200 border border-gray-300 rounded-md px-4 py-2 w-full" /></p>
        <p className="mb-4">תעודת זהות: <input type="id" value={id} onChange={(e) => setId(e.target.value)} className="bg-gray-200 border border-gray-300 rounded-md px-4 py-2 w-full" /></p>
        <p className="mb-4">הערות: <textarea value={comments} onChange={(e) => setComments(e.target.value)} className="bg-gray-200 border border-gray-300 rounded-md px-4 py-2 w-full" /></p>
        {/* פאנל החתימה */}
        <div className="mb-4">
          <SignaturePad
            ref={signaturePadRef}
            canvasProps={{ className: 'border border-gray-300 w-full h-40' }}
            onEnd={handleSaveSignature} // Automatically save signature when the user finishes drawing
          />
        </div>

        {/* File input for ID card image */}
        <div className="mb-4 flex items-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-200 border border-gray-300 rounded-md px-4 py-2 flex items-center"
          >
            <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L12 6M12 18L12 22M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M2 12h4m12 0h4M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42" />
            </svg>
            צירוף צילום תעודת זהות
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>



        {/* כפתורי שמירה וסגירה */}
        <div className="flex justify-end">
          <button
            onClick={handleSignatureSave}
            className="bg-gold text-black px-4 py-2 rounded-md hover:bg-yellow-600"
          >
            שמור וחתום
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;