import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Reorder links
export async function POST(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    const payload = verifyToken(token!);
    const { linkIds } = await request.json(); // Array of link IDs in new order

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update positions for each link
      for (let i = 0; i < linkIds.length; i++) {
        await client.query(
          'UPDATE links SET position = $1 WHERE id = $2 AND user_id = $3',
          [i + 1, linkIds[i], payload?.userId]
        );
      }

      await client.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reorder links' },
      { status: 500 }
    );
  }
}
