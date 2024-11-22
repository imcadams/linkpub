import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Get all links for the authenticated user
export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const result = await pool.query(
      'SELECT id, title, url, position, clicks FROM links WHERE user_id = $1 ORDER BY position',
      [payload.userId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// Create a new link
export async function POST(request: Request) {
    try {
      const token = cookies().get('token')?.value;
      console.log('Received token:', token); // Debug log
      
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
  
      const payload = verifyToken(token);
      console.log('Token payload:', payload); // Debug log
      
      if (!payload) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
  
      const { title, url } = await request.json();
      console.log('Received data:', { title, url }); // Debug log
  
      // Get the highest position number for this user
      const positionResult = await pool.query(
        'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM links WHERE user_id = $1',
        [payload.userId]
      );
      const nextPosition = positionResult.rows[0].next_position;
      console.log('Next position:', nextPosition); // Debug log
  
      const result = await pool.query(
        'INSERT INTO links (user_id, title, url, position) VALUES ($1, $2, $3, $4) RETURNING *',
        [payload.userId, title, url, nextPosition]
      );
      console.log('Inserted link:', result.rows[0]); // Debug log
  
      return NextResponse.json(result.rows[0]);
    } catch (error) {
      console.error('Error creating link:', error);
      return NextResponse.json(
        { error: 'Failed to create link' },
        { status: 500 }
      );
    }
  }
