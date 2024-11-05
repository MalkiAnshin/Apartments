'use client';
import React, { useState, useRef, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fontkit from 'fontkit';

const fontkitModule: any = fontkit;

const ContractModal: React.FC<{ selectedProperty: any; property_type: string; onClose: () => void }> = ({ selectedProperty, property_type, onClose }) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [signed_date, setSigned_date] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const property_id = selectedProperty.property_id;

  const signaturePadRef = useRef<SignaturePad>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser).userId : null;

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
    setSigned_date(formattedDate);
    console.log("Today's date set:", formattedDate);
  }, []);

  const handleSaveSignature = () => {
    if (signaturePadRef.current) {
      setSignature(signaturePadRef.current.toDataURL());
    }

  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setImage(file);

      // המרת התמונה ל-Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSignatureSave = async () => {
    if (!signature || !name || !signed_date || !property_type || !image || !property_id) {
      alert('אנא מלא את כל השדות.');
      console.log("Missing fields:", { signature, name, signed_date, property_type, image, property_id });
      return;
    }

    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkitModule);

      const page = pdfDoc.addPage([600, 800]);
      const fontBytes = await fetch('/fonts/NotoSansHebrew.ttf').then(res => res.arrayBuffer());
      const font = await pdfDoc.embedFont(fontBytes);

      const { width, height } = page.getSize();
      const fontSize = 12;

      page.drawText('פרטי החוזה:', {
        x: 50,
        y: height - 100,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });
      page.drawText(`סוג נכס: ${property_type}`, {
        x: 50,
        y: height - 120,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });
      page.drawText(`מזהה נכס : ${property_id}`, {
        x: 50,
        y: height - 120,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });

      page.drawText(`תאריך: ${signed_date}`, {
        x: 50,
        y: height - 120,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });
      page.drawText(`שם: ${name}`, {
        x: 50,
        y: height - 140,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });
      page.drawText(`תעודת זהות: ${userId}`, {
        x: 50,
        y: height - 160,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });
      page.drawText(`הערות: ${comments}`, {
        x: 50,
        y: height - 180,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });
      page.drawText(`שם: ${name}`, {
        x: 50,
        y: height - 140,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });
      page.drawText(`תעודת זהות: ${imageUrl}`, {
        x: 50,
        y: height - 140,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });


      if (image) {
        const reader = new FileReader();
        reader.onload = async function (event) {
          const imgData = event.target?.result as ArrayBuffer;
          const jpegImage = await pdfDoc.embedJpg(imgData);
          page.drawImage(jpegImage, {
            x: 50,
            y: height - 400,
            width: 100,
            height: 60,
          });
          console.log("ID card image added to PDF");

          const pdfBytes = await pdfDoc.save();
          console.log("PDF document saved");

          const base64Pdf = Buffer.from(pdfBytes).toString('base64');
          console.log("PDF document saved without ID card image");

          // Send the request to the API with property ID
          const response = await fetch('/api/saveContract', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pdfBytes: base64Pdf,
              fileName: `contract_${name}_${signed_date}.pdf`,
              userId: userId, // Replace with actual user ID
              property_type: property_type, // Adjust as needed
              signed_date: signed_date,
              property_id: property_id,
            }),
          });

          if (response.ok) {
            alert('החוזה נשמר בתיקיית "חוזה" בהצלחה!');
            onClose();
          } else {
            alert('שגיאה בשמירת החוזה.');
            const errorText = await response.text();
            console.error('Server error:', errorText);
          }
        };
        reader.readAsArrayBuffer(image);
      } else {
        const pdfBytes = await pdfDoc.save();
        const base64Pdf = Buffer.from(pdfBytes).toString('base64');
        console.log('מנסה לשמור את החוזה');
        const response = await fetch('/api/saveContract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pdfBytes: base64Pdf,
            fileName: `contract_${name}_${signed_date}.pdf`,
            userId: userId, // החלף עם מזהה המשתמש האמיתי
            property_type: property_type,
            signed_date: signed_date,
            property_id:property_id,
          }),
        });
        console.log('נשלחה הבקשה', response);
        console.log({
          pdfBytes: base64Pdf,
          fileName: `contract_${name}_${signed_date}.pdf`,
          userId: 'userId',
          property_type: property_type,
          signed_date: signed_date,
        });

        if (response.ok) {
          alert('החוזה נשמר בתיקיית "חוזה" בהצלחה!');
          onClose();
        } else {
          alert('שגיאה בשמירת החוזה.');
          const errorText = await response.text();
          console.error('Server error:', errorText);
        }
      }
    } catch (error) {
      console.error('שגיאה ביצירת ה-PDF:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-3xl max-h-[90%] overflow-auto">
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
        <div className="mb-6">
          <ul className="list-disc list-inside pl-4">
          </ul>
        </div>

        <label className="block mb-1">תאריך:</label>
        <input
          type="signed_date"
          value={signed_date}
          onChange={(e) => setSigned_date(e.target.value)}
          className="border rounded w-full p-2"
        />

        <p className="mb-4">שם: <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-200 border border-gray-300 rounded-md px-4 py-2 w-full" /></p>
        {/* <p className="mb-4">תעודת זהות: <input type="text" value={id !== undefined ? id.toString() : ''} onChange={(e) => setId(parseInt(e.target.value, 10))} className="bg-gray-200 border border-gray-300 rounded-md px-4 py-2 w-full" /></p> */}
        <p className="mb-4">הערות: <textarea value={comments} onChange={(e) => setComments(e.target.value)} className="bg-gray-200 border border-gray-300 rounded-md px-4 py-2 w-full" /></p>

        <div className="mb-4">
          <SignaturePad
            ref={signaturePadRef}
            canvasProps={{ className: 'border border-gray-300 w-full h-40' }}
            onEnd={handleSaveSignature}
          />
        </div>

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
            id="fileInput"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
        {imageUrl && (
          <div className="mt-4">
            <h3>התמונה שנבחרה:</h3>
            <img src={imageUrl} alt="תמונה" className="border border-gray-300 w-full h-auto" />
          </div>
        )}


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
