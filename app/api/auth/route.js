import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'toolsfinder-secret-key';

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

      return NextResponse.json({
        token,
        user: { id: result.insertId, name, email }
      }, { status: 201 });
    }

    if (action === 'login') {
      const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

      if (users.length === 0) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return NextResponse.json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth API error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
