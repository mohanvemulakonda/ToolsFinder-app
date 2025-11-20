import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let query = 'SELECT * FROM suppliers WHERE verified = 1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY name ASC';

    const [rows] = await pool.execute(query, params);
    return NextResponse.json({ suppliers: rows });
  } catch (error) {
    console.error('Suppliers API error:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, location, phone } = body;

    const [result] = await pool.execute(
      'INSERT INTO suppliers (name, email, location, phone, verified) VALUES (?, ?, ?, ?, 0)',
      [name, email, location, phone]
    );

    return NextResponse.json({ id: result.insertId, message: 'Supplier registered' }, { status: 201 });
  } catch (error) {
    console.error('Create supplier error:', error);
    return NextResponse.json({ error: 'Failed to register supplier' }, { status: 500 });
  }
}
