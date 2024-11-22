import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    const payload = verifyToken(token!);

    const result = await pool.query(
      'SELECT email, username, accent_color, avatar_path FROM users WHERE id = $1',
      [payload?.userId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    const payload = verifyToken(token!);
    const formData = await request.formData();
    
    const accentColor = formData.get('accentColor') as string;
    const avatar = formData.get('avatar') as File | null;
    
    let avatarPath = null;
    if (avatar) {
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create unique filename
      const filename = `${payload?.userId}-${Date.now()}-${avatar.name}`;
      avatarPath = `/uploads/avatars/${filename}`;
      
      // Save file
      await writeFile(
        join(process.cwd(), 'public', avatarPath),
        buffer
      );
    }

    const updateFields = [];
    const values = [];
    let valueCount = 1;

    if (accentColor) {
      updateFields.push(`accent_color = $${valueCount}`);
      values.push(accentColor);
      valueCount++;
    }

    if (avatarPath) {
      updateFields.push(`avatar_path = $${valueCount}`);
      values.push(avatarPath);
      valueCount++;
    }

    if (updateFields.length > 0) {
      values.push(payload?.userId);
      const query = `
        UPDATE users 
        SET ${updateFields.join(', ')} 
        WHERE id = $${valueCount}
        RETURNING email, username, accent_color, avatar_path
      `;

      const result = await pool.query(query, values);
      return NextResponse.json(result.rows[0]);
    }

    return NextResponse.json(
      { error: 'No updates provided' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
