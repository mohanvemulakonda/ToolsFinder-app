import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  try {
    let query = 'SELECT * FROM tools';
    let params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR category LIKE ? OR description LIKE ?';
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm];
    }

    query += ' LIMIT 50';

    const [rows] = await pool.execute(query, params);
    return NextResponse.json({ tools: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch tools', tools: [] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, category, description, supplier_id, price } = body;

    const [result] = await pool.execute(
      'INSERT INTO tools (name, category, description, supplier_id, price) VALUES (?, ?, ?, ?, ?)',
      [name, category, description, supplier_id, price]
    );

    return NextResponse.json({ id: result.insertId, message: 'Tool created' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 });
  }
}
