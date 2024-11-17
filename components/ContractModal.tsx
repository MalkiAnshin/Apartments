import React, { useState, useRef, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ContractModal: React.FC<{ selectedProperty: any; property_type: string; onClose: () => void }> = ({ selectedProperty, property_type, onClose }) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [signed_date, setSigned_date] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // state for image preview
  const property_id = selectedProperty.property_id;

  const signaturePadRef = useRef<SignaturePad>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser).userId : null;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSigned_date(today);
  }, []);

  const handleSaveSignature = () => {
    if (signaturePadRef.current) {
      setSignature(signaturePadRef.current.toDataURL());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureAndSave = async () => {
    if (!signature || !name || !signed_date || !property_type || !property_id || !notes || !image) {
      alert('אנא מלא את כל השדות.');
      return;
    }

    if (formRef.current) {
      try {
        // Capture the form as an image
        const canvas = await html2canvas(formRef.current);
        const imgData = canvas.toDataURL('image/png');

        // Convert the image to a PDF
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 180, 0);

        // Generate a blob from the PDF
        const pdfBlob = pdf.output('blob');

        // Append form data and PDF file to be sent to the server
        const formData = new FormData();
        formData.append('signature', signature);
        formData.append('name', name);
        formData.append('signed_date', signed_date);
        formData.append('property_type', property_type);
        formData.append('property_id', property_id);
        formData.append('notes', notes);
        formData.append('userId', userId || '');
        formData.append('pdf', pdfBlob, 'contract.pdf');
        formData.append('image', image);

        // Send the form data to the server
        const response = await fetch('/api/saveContract', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('החוזה נשמר בהצלחה!');
          onClose();
        } else {
          const errorText = await response.text();
          console.error('Server Error:', errorText);
          alert(`שגיאה: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('Network Error:', error);
        alert('שגיאה בתקשורת לשרת. נסי שוב.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto z-50">
<div ref={formRef} className="bg-white text-black p-6 rounded-lg w-full max-w-3xl mx-4 sm:mx-6 lg:max-w-4xl max-h-screen overflow-auto">
<h2 className="text-2xl font-bold mb-4">חתום על החוזה</h2>
        <p className="text-base mb-2">טופס הזמנת שירותי תיווך בלעדיים למכירת/השכרת נכס מקרקעין 0014</p>
        <p className="text-sm mb-2">(בהתאם ל"חוק המתווכים במקרקעין, התשנ"ז 1996")</p>
        <h3 className="text-lg font-semibold mb-2">סעיפים:</h3>
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
        <div className="my-4">
          <label className="block text-sm font-medium mb-2">שם מלא</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>
        <label className="block mb-1">תאריך:</label>
        <input
          type="date"
          value={signed_date}
          onChange={(e) => setSigned_date(e.target.value)}
          className="border rounded w-full p-2"
        />
        <div className="my-4">
          <label className="block text-sm font-medium mb-2">הערות</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 border rounded"></textarea>
        </div>
        <div className="my-4">
          <label className="block text-sm font-medium mb-2">חתימה</label>
          <SignaturePad ref={signaturePadRef} onEnd={handleSaveSignature} canvasProps={{ width: 500, height: 200, className: 'border' }} />
        </div>
        <div className="my-4">
          <div className="flex items-center space-x-2">
            <img width="30" height="30" src="https://img.icons8.com/ios/50/insert-page.png" alt="insert-page" />
            <label className="block text-sm font-medium">העלה צילום תעודת זהות</label>
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full mt-2 px-3 py-2 border rounded" />
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={onClose} className="bg-gray-300 text-black py-2 px-4 rounded">סגור</button>
          <button onClick={handleCaptureAndSave} className="bg-black text-white py-2 px-4 rounded">שלח וחתום</button>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
