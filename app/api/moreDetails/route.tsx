import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request: Request) {
    const { apartmentId, userId } = await request.json(); // Make sure to parse the JSON correctly

    // Input validation
    if (!userId || !apartmentId) {
        console.warn('Warning: userId and apartmentId are required but not received');
        return NextResponse.json({ error: 'userId and apartmentId are required' }, { status: 400 });
    }

    try {
        console.info(`Checking contract existence for user ${userId} and apartment ${apartmentId}`);

        // Database query to check the existence of a contract for the specified apartment
        const query = `
            SELECT EXISTS (
                SELECT 1
                FROM contracts
                WHERE user_id = $1 AND property_id = $2
            ) AS exists_contract
        `;
        const result = await pool.query(query, [userId, apartmentId]);


        return NextResponse.json({ exists: result.rows[0].exists_contract });
    } catch (error) {
        console.error('Error executing database query:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
