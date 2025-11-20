import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'toolsfinder-secret';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (action === 'register') {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      const token = jwt.sign({ userId: result.insertId, email }, JWT_SECRET, { expiresIn: '7d' });
      return NextResponse.json({ token, userId: result.insertId });
    }

    if (action === 'login') {
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

      if (rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
      }

      const user = rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }

      const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
      return NextResponse.json({ token, userId: user.id, name: user.name });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
