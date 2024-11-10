import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import pool from '../../../lib/db'; // Update the path to your database file

export async function POST(request: Request) {
  try {
    // console.log('--- Starting POST request to add property ---');

    const formData = await request.formData();

    // Read apartment details from the request and trim unnecessary spaces
    const city = (formData.get('city') as string).trim().replace(/\s+/g, ' '); // Trim city
    const neighborhood = (formData.get('neighborhood') as string).trim().replace(/\s+/g, ' '); // Trim neighborhood
    const price = (formData.get('price') as string).trim(); // Trim price
    const rooms = (formData.get('rooms') as string).trim(); // Trim rooms
    const propertyType = (formData.get('propertyType') as string).trim(); // Get property type
    const images = formData.getAll('images'); // Array of files
    const imageNames = images.map((_, index: number) => `${index + 1}.jpg`); // Create names for images (1.jpg, 2.jpg, etc.)
    const userId = (formData.get('userId') as string).trim(); // Add userId
    // Additional property fields
    const hasBalcony = formData.get('hasBalcony') === 'true';
    const floor = parseInt((formData.get('floor') as string).trim(), 10);
    const contactSeller = (formData.get('contactSeller') as string).trim();
    const address = (formData.get('address') as string).trim();
    const elevator = formData.get('elevator') === 'true';
    const warehouse = formData.get('warehouse') === 'true';
    const parking = formData.get('parking') === 'true';

    // Log parsed values for debugging
    // console.log({
    //   city, neighborhood, price, rooms, propertyType, userId, hasBalcony, floor,
    //   contactSeller, address, elevator, warehouse, parking
    // });

    // Save the property in the database based on its type
    const client = await pool.connect();
    let query, values;

    // Format imageNames as a PostgreSQL array literal
    const imageArray = `{${imageNames.join(',')}}`;

    // Query construction based on property type
    if (propertyType === 'Apartment') {
      query = `
        INSERT INTO apartments (city, neighborhood, price, rooms, image_paths, user_id, has_balcony, floor, contact_seller, address, elevator, warehouse, parking)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING property_id`;
      values = [city, neighborhood, price, rooms, imageArray, userId, hasBalcony, floor, contactSeller, address, elevator, warehouse, parking];
    } else if (propertyType === 'Project') {
      query = `
        INSERT INTO projects (city, neighborhood, price, rooms, image_paths)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING property_id`;
      values = [city, neighborhood, price, rooms, imageArray];
    } else if (propertyType === 'Land') {
      query = `
        INSERT INTO lands (city, neighborhood, price, rooms, image_paths)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING property_id`;
      values = [city, neighborhood, price, rooms, imageArray];
    } else if (propertyType === 'Business') {
      query = `
        INSERT INTO business (city, neighborhood, price, rooms, image_paths)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING property_id`;
      values = [city, neighborhood, price, rooms, imageArray];
    } else {
      throw new Error('Invalid property type');
    }

    // Insert into the database
    // console.log('Executing query to insert property into the database');
    const result = await client.query(query, values);
    const propertyId = result.rows[0].property_id;
    // console.log(`Property inserted with ID: ${propertyId}`);

    // ** Update the user's first_listing_free to TRUE **
    const updateQuery = `
      UPDATE users
      SET first_listing_free = TRUE
      WHERE identity_number = $1
    `;
    await client.query(updateQuery, [userId]);

    // console.log(`User ${userId}'s first_listing_free has been updated to TRUE`);

    client.release();

    // Create a directory for the property under public/pictures/<property_id>
    const propertyDir = path.join(process.cwd(), 'public', 'pictures', propertyType, propertyId.toString());
    // console.log(`Creating directory for property images at: ${propertyDir}`);
    await fs.mkdir(propertyDir, { recursive: true });

    // Save the images in the directory with numeric names (1.jpg, 2.jpg, etc.)
    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i] as File;
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const filePath = path.join(propertyDir, `${i + 1}.jpg`);
      // console.log(`Saving image to: ${filePath}`);
      await fs.writeFile(filePath, imageBuffer);
    }

    return NextResponse.json({ message: 'Property added successfully!', propertyId });
  } catch (error) {
    console.error('Error saving property:', error);
    return NextResponse.json({ error: 'Error saving property' }, { status: 500 });
  }
}
