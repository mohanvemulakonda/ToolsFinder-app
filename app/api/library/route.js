import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const [rows] = await pool.execute(
      `SELECT l.*, t.name, t.description, t.category, t.price
       FROM user_library l
       JOIN tools t ON l.tool_id = t.id
       WHERE l.user_id = ?
       ORDER BY l.added_at DESC`,
      [userId]
    );

    return NextResponse.json({ library: rows });
  } catch (error) {
    console.error('Library API error:', error);
    return NextResponse.json({ error: 'Failed to fetch library' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, toolId } = body;

    if (!userId || !toolId) {
      return NextResponse.json({ error: 'User ID and Tool ID required' }, { status: 400 });
    }

    await pool.execute(
      'INSERT INTO user_library (user_id, tool_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE added_at = NOW()',
      [userId, toolId]
    );

    return NextResponse.json({ message: 'Added to library' }, { status: 201 });
  } catch (error) {
    console.error('Add to library error:', error);
    return NextResponse.json({ error: 'Failed to add to library' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const toolId = searchParams.get('toolId');

    if (!userId || !toolId) {
      return NextResponse.json({ error: 'User ID and Tool ID required' }, { status: 400 });
    }

    await pool.execute(
      'DELETE FROM user_library WHERE user_id = ? AND tool_id = ?',
      [userId, toolId]
    );

    return NextResponse.json({ message: 'Removed from library' });
  } catch (error) {
    console.error('Remove from library error:', error);
    return NextResponse.json({ error: 'Failed to remove from library' }, { status: 500 });
  }
}
