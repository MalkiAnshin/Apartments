import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request: Request) {
    const { apartmentId, userId, propertyType } = await request.json(); // Make sure to parse the JSON correctly

    // Input validation
    if (!userId || !apartmentId || !propertyType) {
        console.warn('Warning: userId, apartmentId and propertyType are required but not received');
        return NextResponse.json({ error: 'userId, apartmentId and propertyType are required' }, { status: 400 });
    }

    try {
        console.info(`Checking contract existence for user ${userId}, apartment ${apartmentId} and property type ${propertyType}`);

        // Database query to check the existence of a contract for the specified apartment and property type
        const query = `
            SELECT EXISTS (
                SELECT 1
                FROM contracts
                WHERE user_id = $1 AND property_id = $2 AND property_type = $3
            ) AS exists_contract
        `;
        const result = await pool.query(query, [userId, apartmentId, propertyType]);

        return NextResponse.json({ exists: result.rows[0].exists_contract });
    } catch (error) {
        console.error('Error executing database query:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
