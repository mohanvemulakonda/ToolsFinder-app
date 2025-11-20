import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    let query = 'SELECT * FROM tools WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT 50';

    const [rows] = await pool.execute(query, params);
    return NextResponse.json({ tools: rows });
  } catch (error) {
    console.error('Tools API error:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, category, supplier_id, price } = body;

    const [result] = await pool.execute(
      'INSERT INTO tools (name, description, category, supplier_id, price) VALUES (?, ?, ?, ?, ?)',
      [name, description, category, supplier_id, price]
    );

    return NextResponse.json({ id: result.insertId, message: 'Tool created' }, { status: 201 });
  } catch (error) {
    console.error('Create tool error:', error);
    return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 });
  }
}
