import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const city = url.searchParams.get('city')?.trim();
    const neighborhood = url.searchParams.get('neighborhood')?.trim();
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const userType = url.searchParams.get('userType')?.trim();

    try {
        const client = await pool.connect();
        console.log('Database client connected');

        // Create basic query and parameter array
        let query = 'SELECT * FROM business WHERE 1=1';
        const params: (string | number)[] = [];

        // Add filters based on provided parameters
        if (city) {
            params.push(city);
            query += ` AND city = $${params.length}`;
        }

        if (neighborhood) {
            params.push(neighborhood);
            query += ` AND neighborhood = $${params.length}`;
        }

        if (minPrice) {
            params.push(Number(minPrice));
            query += ` AND price >= $${params.length}`;
        }

        if (maxPrice) {
            params.push(Number(maxPrice));
            query += ` AND price <= $${params.length}`;
        }

        if (userType) {
            params.push(userType);
            query += ` AND user_type = $${params.length}`;
        }

        console.log('Final query:', query);
        console.log('Query parameters:', params);

        const { rows } = await client.query(query, params);
        client.release();

        console.log('Fetched businesses:', rows);

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching businesses:', error);
        return NextResponse.json(
            {
                error: 'Error fetching businesses',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
