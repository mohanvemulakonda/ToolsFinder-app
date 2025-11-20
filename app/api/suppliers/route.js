import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM suppliers');
    return NextResponse.json({ suppliers: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers', suppliers: [] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    const [result] = await pool.execute(
      'INSERT INTO suppliers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone, address]
    );

    return NextResponse.json({ id: result.insertId, message: 'Supplier created' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
