import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // Ensure the path is correct

// GET handler to fetch all messages
export async function GET(request: Request) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM contactMessages'); // Query to select all messages
    client.release();

    return NextResponse.json(rows); // Return the messages data
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({
      error: 'Error fetching messages',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// DELETE handler to remove a message by ID
export async function DELETE(request: Request) {
  try {
    const { messageId } = await request.json(); // Get the messageId from the request body
    const client = await pool.connect();

    // Perform the deletion from the database
    const result = await client.query('DELETE FROM contactMessages WHERE message_id = $1 RETURNING *', [messageId]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({
        error: 'Message not found or already deleted',
      }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({
      error: 'Error deleting message',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
