import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request: Request) {
    // Log incoming request
    console.info('Received request:', request);

    // Parsing the JSON data from the request body
    const { landId, userId, propertyType } = await request.json();
    console.info('Parsed request body:', { landId, userId, propertyType });

    // Input validation
    if (!userId || !landId || !propertyType) {
        console.warn('Warning: userId, landId, and propertyType are required but not received');
        return NextResponse.json({ error: 'userId, landId, and propertyType are required' }, { status: 400 });
    }

    try {
        // Log input data before executing query
        console.info(`Checking contract existence for user ${userId}, land ${landId} and property type ${propertyType}`);

        // Database query to check the existence of a contract for the specified land and property type
        const query = `
            SELECT EXISTS (
                SELECT 1
                FROM contracts
                WHERE user_id = $1 AND property_id = $2 AND property_type = $3
            ) AS exists_contract
        `;
        // Log query execution
        console.info('Executing query:', query, 'with params:', [userId, landId, propertyType]);

        const result = await pool.query(query, [userId, landId, propertyType]);

        // Log query result
        console.info('Query result:', result.rows[0]);

        return NextResponse.json({ exists: result.rows[0].exists_contract });
    } catch (error) {
        // Log error details
        console.error('Error executing database query:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
