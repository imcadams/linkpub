import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    // Fetch user profile
    const userResult = await pool.query(
      `SELECT id, username, accent_color, avatar_path 
       FROM users 
       WHERE username = $1`,
      [params.username]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Fetch user's links
    const linksResult = await pool.query(
      `SELECT id, title, url, position, clicks 
       FROM links 
       WHERE user_id = $1 
       ORDER BY position`,
      [user.id]
    );

    return NextResponse.json({
      profile: {
        username: user.username,
        accentColor: user.accent_color,
        avatarPath: user.avatar_path,
      },
      links: linksResult.rows,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 