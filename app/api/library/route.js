import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const [rows] = await pool.execute(
      `SELECT l.*, t.name, t.category, t.description
       FROM library l
       JOIN tools t ON l.tool_id = t.id
       WHERE l.user_id = ?`,
      [userId || 1]
    );
    return NextResponse.json({ library: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch library', library: [] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { toolId, userId = 1 } = body;

    const [result] = await pool.execute(
      'INSERT INTO library (user_id, tool_id) VALUES (?, ?)',
      [userId, toolId]
    );

    return NextResponse.json({ id: result.insertId, message: 'Added to library' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to add to library' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await pool.execute('DELETE FROM library WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Removed from library' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to remove from library' }, { status: 500 });
  }
}
