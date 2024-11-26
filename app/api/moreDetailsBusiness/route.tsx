import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request: Request) {
    console.info('Received POST request to check contract existence'); // Log when the POST request is received.

    // Parsing the JSON data from the request body
    const { property_id, userId, property_type } = await request.json();
    console.info('Parsed request body:', { property_id, userId, property_type }); // Log the parsed data.

    // Input validation
    if (!userId || !property_id || !property_type) {
        console.warn('Warning: userId, property_id and property_type are required but not received');
        return NextResponse.json({ error: 'userId, property_id and property_type are required' }, { status: 400 });
    }

    console.info(`Validated input data: userId=${userId}, property_id=${property_type}, property_type=${property_type}`); // Log after validation

    try {
        // Log the contract check process
        console.info(`Checking contract existence for userId: ${userId}, property_id: ${property_id}, property_type: ${property_type}`);

        // Database query to check the existence of a contract for the specified business and property type
        const query = `
            SELECT EXISTS (
                SELECT 1
                FROM contracts
                WHERE user_id = $1 AND property_id = $2 AND property_type = $3
            ) AS exists_contract
        `;
        console.log('Executing query:', query); // Log the query structure
        console.log('With parameters:', { userId, property_id, property_type }); // Log the query parameters

        const result = await pool.query(query, [userId, property_id, property_type]);

        // Log the result of the query
        console.log('Query result:', result.rows); // Log the result rows returned from the database

        // Return the result of the contract check
        return NextResponse.json({ exists: result.rows[0].exists_contract });
    } catch (error) {
        // Log any errors that occur during query execution
        console.error('Error executing database query:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
