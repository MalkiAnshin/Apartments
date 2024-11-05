import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request: Request) {
  try {
    console.log('--- Starting POST request to save contract ---');
    
    // Parse the request body from JSON
    const { userId, property_type, fileName, pdfBytes, signed_date, property_id } = await request.json();
    console.log('Parsed request body:', { userId, property_type, fileName, property_id, pdfBytes: pdfBytes ? '[PDF Content Present]' : '[Missing PDF Content]' });

    // Check required fields
    const missingFields = [];
    if (!userId) missingFields.push('userId');
    if (!property_type) missingFields.push('property_type');
    if (!fileName) missingFields.push('fileName');
    if (!property_id) missingFields.push('property_id');
    if (!pdfBytes) missingFields.push('pdfBytes');


    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json({ success: false, message: 'Missing required fields', missingFields }, { status: 400 });
    }

    // Default `signed_date` if not provided
    const currentSignedDate = signed_date || new Date().toISOString();
    console.log(`Using signed_date: ${currentSignedDate}`);

    // Insert contract data into the database
    const result = await pool.query(
      'INSERT INTO contracts (user_id, property_type, file_name, signed_date, property_id) VALUES ($1, $2, $3, $4, $5) RETURNING contract_id',
      [userId, property_type, fileName, currentSignedDate, property_id]
    );

    if (!result || result.rows.length === 0) {
      console.error('Failed to insert contract data.');
      return NextResponse.json({ success: false, message: 'Failed to insert contract data' }, { status: 500 });
    }

    const contractId = result.rows[0].contract_id;
    console.log(`Successfully inserted contract with ID: ${contractId}`);

    return NextResponse.json({ success: true, contractId, message: 'Contract saved successfully' });
  } catch (error) {
    console.error('Error saving contract:', error);
    return NextResponse.json({ success: false, message: 'Error saving contract', error: error.message }, { status: 500 });
  }
}
