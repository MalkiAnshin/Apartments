import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import pool from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    console.log('Form data received:', Object.fromEntries(formData.entries()));

    const formDataObject = Object.fromEntries(formData.entries());

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

    const businessType = (formData.get('business_type') as string | null)?.trim() || '';
    const monthlyYield = (formData.get('monthly_yield') as string | null)?.trim() || '';
    const size = (formData.get('size') as string | null)?.trim() || '';

    const client = await pool.connect();

    let query, values;
    const imageArray = `{${imageNames.join(',')}}`;

    if (propertyType === 'Apartment') {
      query = `
        INSERT INTO apartments (city, neighborhood, price, rooms, image_paths, user_id, has_balcony, floor, contact_seller, address, elevator, warehouse, parking)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING property_id`;
      values = [city, neighborhood, price, rooms, imageArray, userId, hasBalcony, floor, contactSeller, address, elevator, warehouse, parking];
    } else if (propertyType === 'Project') {
      query = `
        INSERT INTO projects (city, neighborhood, price, rooms, image_paths, user_id, has_balcony, floor, contact_seller, address, elevator, warehouse, parking, isBuilt)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING property_id`;
      values = [city, neighborhood, price, rooms, imageArray, userId, hasBalcony, floor, contactSeller, address, elevator, warehouse, parking, isBuilt];
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
    } else {
      throw new Error('Invalid property type');
    }

    const result = await client.query(query, values);
    const propertyId = result.rows[0].property_id;

    await client.query(`UPDATE users SET remaining_listings = remaining_listings - 1 WHERE identity_number = $1`, [userId]);

    client.release();

    // הדפסת הנתיב שבו הקוד רץ בפועל
    console.log('📁 __dirname:', __dirname);

    // שמירה יחסית למיקום האמיתי של הסקריפט
    const relativeRoot = path.join(__dirname, '../../../../../../public/userfiles/pictures', propertyType, propertyId.toString());
    console.log('📂 Saving images to relative path:', relativeRoot);

    console.log('--- IMAGE UPLOAD PROCESS START ---');
    try {
      await fs.mkdir(relativeRoot, { recursive: true });
      const dirStat = await fs.stat(relativeRoot).then(() => true).catch(() => false);
      console.log('Directory created:', dirStat);
    } catch (mkdirErr) {
      console.error('❌ Failed to create image directory:', mkdirErr);
      throw mkdirErr;
    }

    console.log('Number of images to save:', images.length);

    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i] as File;
      console.log(`→ Processing image #${i + 1}: ${imageFile.name}, ${imageFile.size} bytes`);

      try {
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        console.log(`→ Buffer created, size: ${imageBuffer.length} bytes`);

        const filePath = path.join(relativeRoot, `${i + 1}.jpg`);
        console.log('→ Saving to:', filePath);

        await fs.writeFile(filePath, imageBuffer);

        const exists = await fs.stat(filePath).then(() => true).catch(() => false);
        console.log(`✓ Image #${i + 1} saved?`, exists);
      } catch (imgErr) {
        console.error(`❌ Error saving image #${i + 1}:`, imgErr);
      }
    }

    console.log('--- IMAGE UPLOAD PROCESS END ---');

    return NextResponse.json({ message: 'Property added successfully!', propertyId });

  } catch (error) {
    console.error('❌ Error saving property:', error);
    return NextResponse.json({ error: 'Error saving property' }, { status: 500 });
  }
}
