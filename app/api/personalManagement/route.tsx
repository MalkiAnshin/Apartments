import { NextResponse } from 'next/server';
import pool from '../../../lib/db';  // נייבא את החיבור למסד נתונים

// POST - שמירת נתוני מכירת נכס
export async function POST(req) {
  const { propertyId, soldTo, soldDate, soldPrice, sellerId, property_type, contact_seller } = await req.json();

  console.log('Received POST request with data:', { propertyId, soldTo, soldDate, soldPrice, sellerId, property_type, contact_seller });

  if (!propertyId || !soldTo || !soldDate || !soldPrice || !sellerId || !property_type || !contact_seller) {
    console.log('Error: Missing required fields');
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    console.log(`Inserting sold property data for propertyId: ${propertyId}`);
    await pool.query(
      `INSERT INTO sold_property (property_id, sold_to, sold_date, price, seller_id, property_type, contact_seller)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [propertyId, soldTo, soldDate, soldPrice, sellerId, property_type, contact_seller]
    );
    console.log(`Sold property data inserted for propertyId: ${propertyId}`);

    // אם הנתונים הוזנו בהצלחה, לבצע את מחיקת הנכס
    console.log(`Deleting property with propertyId: ${propertyId}`);
    await pool.query('DELETE FROM apartments WHERE property_id = $1', [propertyId]);
    console.log(`Property with propertyId: ${propertyId} deleted from apartments`);

    return NextResponse.json({ message: 'Property sale information saved and property deleted successfully' });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Error saving property sale information or deleting property' }, { status: 500 });
  }
}

// GET - קבלת נכסים לפי מזהה משתמש
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  console.log(`Received GET request for userId: ${userId}`);

  if (!userId) {
    console.log('Error: userId is missing');
    return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
  }

  try {
    console.log(`Fetching properties for userId: ${userId}`);
    // שאילתא לקבלת הנכסים לפי userId
    const result = await pool.query('SELECT * FROM apartments WHERE user_id = $1', [userId]);

    console.log(`Found ${result.rows.length} properties for userId: ${userId}`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Error fetching properties' }, { status: 500 });
  }
}


// DELETE - מחיקת נכס
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get('propertyId');

  console.log(`Received DELETE request for propertyId: ${propertyId}`);

  if (!propertyId) {
    console.log('Error: propertyId is missing');
    return NextResponse.json({ error: 'propertyId is required' }, { status: 400 });
  }

  try {
    console.log(`Deleting property with propertyId: ${propertyId}`);
    // שאילתא למחוק את הנכס מהטבלה
    await pool.query('DELETE FROM apartments WHERE property_id = $1', [propertyId]);
    console.log(`Property with propertyId: ${propertyId} deleted`);

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error processing DELETE request:', error);
    return NextResponse.json({ error: 'Error deleting property' }, { status: 500 });
  }
}

