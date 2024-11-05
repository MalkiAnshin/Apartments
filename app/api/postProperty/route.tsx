import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import pool from '../../../lib/db'; // Update the path to your database file

export async function POST(request: Request) {
  let client;
  try {
    const formData = await request.formData();

    // Read apartment details from the request and trim unnecessary spaces
    const propertyType = (formData.get('propertyType') as string | null)?.trim() || '';
    const city = (formData.get('city') as string | null)?.trim() || '';
    const neighborhood = (formData.get('neighborhood') as string | null)?.trim() || '';
    const price = parseFloat((formData.get('price') as string | null)?.trim() || '0');
    const rooms = parseInt((formData.get('rooms') as string | null)?.trim() || '0', 10);
    const hasBalcony = formData.get('hasBalcony') === 'true';
    const userId = (formData.get('userId') as string | null)?.trim() || '';
    const floor = parseInt((formData.get('floor') as string | null)?.trim() || '0', 10);
    const parking = formData.get('parking') === 'true';
    const warehouse = formData.get('warehouse') === 'true';
    const elevator = formData.get('elevator') === 'true';
    const address = (formData.get('address') as string | null)?.trim() || '';
    const contactSeller = (formData.get('contactSeller') as string | null)?.trim() || '';
    const images = formData.getAll('images');

    // Validate images
    if (images.length === 0) {
      console.log('No images provided');
      return NextResponse.json({ error: 'At least one image must be provided' }, { status: 400 });
    }

    // Create an array of image file names
    const imageNames = images.map((_, index) => `${index + 1}.jpg`);

    // Validate required fields
    if (!propertyType || !city || !neighborhood || isNaN(price) || isNaN(rooms) || isNaN(floor) || !hasBalcony || !userId || !address || !contactSeller ) {
      console.log('Missing required fields:', {
        propertyType,
        city,
        neighborhood,
        price,
        rooms,
        floor,
        hasBalcony,
        userId,
        address,
        contactSeller,
      });
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
    }

    // Log parsed values for debugging
    console.log('Parsed values:', { propertyType, city, neighborhood, price, rooms, userId, floor, hasBalcony, imageNames, parking, warehouse, elevator, address, contactSeller });

    client = await pool.connect();
    let query, values;

    // Property insertion logic
    if (propertyType === 'Apartment') {
      query = `
        INSERT INTO apartments (city, neighborhood, price, rooms, floor, has_balcony, user_id, parking, warehouse, elevator, address, contact_seller, image_paths)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING property_id
      `;
      values = [city, neighborhood, price, rooms, floor, hasBalcony, userId, parking, warehouse, elevator, address, contactSeller, imageNames];
    } else {
      throw new Error('Invalid property type');
    }

    const result = await client.query(query, values);
    const propertyId = result.rows[0].property_id;

    console.log('Inserted property ID:', propertyId);

    // Create a directory for the property under public/pictures/<property_id>
    const propertyDir = path.join(process.cwd(), 'public', 'pictures', propertyType, propertyId.toString());
    await fs.mkdir(propertyDir, { recursive: true });

    // Save the images in the directory with numeric names (1.jpg, 2.jpg, etc.)
    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i] as File;
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const filePath = path.join(propertyDir, `${i + 1}.jpg`);
      await fs.writeFile(filePath, imageBuffer);
    }

    // Update FIRST_LISTING_FREE for the user
    const updateResult = await client.query(`UPDATE users SET first_listing_free = TRUE WHERE user_id = $1`, [userId]);

    if (updateResult.rowCount > 0) {
      console.log(`User ID ${userId} first_listing_free updated to TRUE.`);
    } else {
      console.log(`No user found with ID ${userId}. No update was made.`);
    }

    return NextResponse.json({ message: 'Property added successfully!', propertyId });
  } catch (error) {
    console.error('Error saving property:', error);
    return NextResponse.json({ error: 'Error saving property' }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}
