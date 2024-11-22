import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Track link clicks
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query(
      'UPDATE links SET clicks = clicks + 1 WHERE id = $1',
      [params.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
