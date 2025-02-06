import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import pool from '../../../lib/db'; // Update the path to your database file

export async function POST(request: Request) {
  try {

    const formData = await request.formData();
    
    const formDataObject = Object.fromEntries(formData.entries());

    // Read apartment details from the request and trim unnecessary spaces
    const city = (formData.get('city') as string | null)?.trim().replace(/\s+/g, ' ') || '';
    const neighborhood = (formData.get('neighborhood') as string | null)?.trim().replace(/\s+/g, ' ') || '';
    const price = (formData.get('price') as string | null)?.trim() || '';
    const rooms = (formData.get('rooms') as string | null)?.trim() || '';
    const propertyType = (formData.get('propertyType') as string | null)?.trim() || '';
    const images = formData.getAll('images');
    const imageNames = images.map((_, index: number) => `${index + 1}.jpg`);
    const userId = (formData.get('userId') as string | null)?.trim() || '';
    const hasBalcony = formData.get('hasBalcony') === 'true';
    const floor = parseInt((formData.get('floor') as string)?.trim() || '0', 10);
    const contactSeller = (formData.get('contactSeller') as string | null)?.trim() || '';
    const address = (formData.get('address') as string | null)?.trim() || '';
    const elevator = formData.get('elevator') === 'true';
    const warehouse = formData.get('warehouse') === 'true';
    const parking = formData.get('parking') === 'true';
    const isBuilt = formData.get('isBuilt') === 'true';
    const buildableArea = formData.get('buildable_area') === 'true';

    // For Business property type
    const businessType = (formData.get('business_type') as string | null)?.trim() || '';
    const monthlyYield = (formData.get('monthly_yield') as string | null)?.trim() || '';

    // For Land property type
    const size = (formData.get('size') as string | null)?.trim() || '';

    // Save the property in the database based on its type
    const client = await pool.connect();

    let query, values;
    const imageArray = `{${imageNames.join(',')}}`;  // PostgreSQL array literal for image paths

    // Construct the query based on property type
    if (propertyType === 'Apartment') {
      query = `
        INSERT INTO apartments (city, neighborhood, price, rooms, image_paths, user_id, has_balcony, floor, contact_seller, address, elevator, warehouse, parking)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING property_id`;
      values = [city, neighborhood, price, rooms, imageArray, userId, hasBalcony, floor, contactSeller, address, elevator, warehouse, parking];
    } else if (propertyType === 'Project') {
      query = `
        INSERT INTO projects (city, neighborhood, price, rooms, image_paths, is_built)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING property_id`;
      values = [city, neighborhood, price, rooms, imageArray, isBuilt];
    } else if (propertyType === 'Land') {
      query = `
        INSERT INTO lands (city, neighborhood, price, size, buildable_area, user_id, address, contact_info)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING property_id`;
      values = [city, neighborhood, price, size, buildableArea, userId, address, contactSeller];
    } else if (propertyType === 'Business') {
      query = `
        INSERT INTO business (city, neighborhood, price, size, business_type, monthly_yield, user_id, address, contact_info)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING property_id`;
      values = [city, neighborhood, price || null, size || null, businessType || null, monthlyYield || null, userId || null, address || null, contactSeller || null];
    }
    else {
      throw new Error('Invalid property type');
    }

    // Insert into the database
    const result = await client.query(query, values);
    const propertyId = result.rows[0].property_id;

    // Update the user's first_listing_free flag
    const updateQuery = `
      UPDATE users
      SET first_listing_free = TRUE
      WHERE identity_number = $1`;
    await client.query(updateQuery, [userId]);

    client.release();

    // Create a directory for the property images
    const propertyDir = path.join(process.cwd(), 'public', 'pictures', propertyType, propertyId.toString());
    await fs.mkdir(propertyDir, { recursive: true });

    // Save the images in the directory
    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i] as File;
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const filePath = path.join(propertyDir, `${i + 1}.jpg`);
      await fs.writeFile(filePath, imageBuffer);
    }

    return NextResponse.json({ message: 'Property added successfully!', propertyId });
  } catch (error) {
    console.error('Error saving property:', error);
    return NextResponse.json({ error: 'Error saving property' }, { status: 500 });
  }
}
