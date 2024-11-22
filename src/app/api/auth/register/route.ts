import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    // Validate input
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Test database connection
    try {
      await pool.query('SELECT NOW()');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const hashedPassword = await hashPassword(password);

    try {
      const result = await pool.query(
        'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id',
        [email, hashedPassword, username]
      );

      return NextResponse.json({ success: true });
    } catch (queryError: any) {
      console.error('Query error:', queryError);

      if (queryError.code === '23505') { // unique violation
        if (queryError.constraint === 'users_email_key') {
          return NextResponse.json(
            { error: 'Email already exists' },
            { status: 400 }
          );
        }
        if (queryError.constraint === 'users_username_key') {
          return NextResponse.json(
            { error: 'Username already exists' },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}