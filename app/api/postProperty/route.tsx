import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import pool from '../../../lib/db'; // Update the path to your database file

export async function POST(request: Request) {
  try {
    const formData = await request.formData();


    // Read apartment details from the request and trim unnecessary spaces
    const city = (formData.get('city') as string).trim().replace(/\s+/g, ' ');
    const neighborhood = (formData.get('neighborhood') as string).trim().replace(/\s+/g, ' ');
    const price = (formData.get('price') as string).trim();
    const rooms = (formData.get('rooms') as string).trim();
    const propertyType = (formData.get('propertyType') as string).trim();
    const userId = Number(formData.get('userId')); // Get userId as a number
    const images = formData.getAll('images');
    const imageNames = images.map((_, index: number) => `${index + 1}.jpg`);

    console.log('Received data:', {
      city,
      neighborhood,
      price,
      rooms,
      propertyType,
      userId,
      imageNames,
    });

    // Save the property in the database based on its type
    const client = await pool.connect();
    let query, values;

    // Property insertion logic
    if (propertyType === 'Apartment') {
      query = `INSERT INTO apartments (city, neighborhood, price, rooms, image_paths) VALUES ($1, $2, $3, $4, $5) RETURNING property_id`;
    } else if (propertyType === 'Project') {
      query = `INSERT INTO projects (city, neighborhood, price, rooms, image_paths) VALUES ($1, $2, $3, $4, $5) RETURNING property_id`;
    } else if (propertyType === 'Land') {
      query = `INSERT INTO lands (city, neighborhood, price, rooms, image_paths) VALUES ($1, $2, $3, $4, $5) RETURNING property_id`;
    } else if (propertyType === 'Business') {
      query = `INSERT INTO business (city, neighborhood, price, rooms, image_paths) VALUES ($1, $2, $3, $4, $5) RETURNING property_id`;
    } else {
      throw new Error('Invalid property type');
    }

    values = [city, neighborhood, price, rooms, imageNames];
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

    
    // Log before updating FIRST_LISTING_FREE
    console.log('Updating FIRST_LISTING_FREE for user ID:', userId);


    
    // Update FIRST_LISTING_FREE for the user
    const updateResult = await client.query(`UPDATE users SET first_listing_free = TRUE WHERE identity_number = $1`, [userId]);

    // Log the result of the update
    if (updateResult.rowCount > 0) {
      console.log(`User ID ${userId} first_listing_free updated to TRUE.`);
    } else {
      console.log(`No user found with ID ${userId}. No update was made.`);
    }

    client.release();

    return NextResponse.json({ message: 'Property added successfully!', propertyId });
  } catch (error) {
    console.error('Error saving property:', error);
    return NextResponse.json({ error: 'Error saving property' }, { status: 500 });
  }
}
