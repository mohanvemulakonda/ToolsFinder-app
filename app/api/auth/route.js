import { NextResponse } from 'next/server'
const pool = require('../../../lib/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'toolsfinder-secret'

export async function POST(request) {
  try {
    const body = await request.json()
    const { action, email, password, name } = body
    
    if (action === 'register') {
      const hashedPassword = await bcrypt.hash(password, 10)
      const [result] = await pool.execute(
        'INSERT INTO User (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name]
      )
      const token = jwt.sign({ userId: result.insertId, email }, JWT_SECRET)
      return NextResponse.json({ token, userId: result.insertId })
    }
    
    if (action === 'login') {
      const [users] = await pool.execute('SELECT * FROM User WHERE email = ?', [email])
      if (users.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      const user = users[0]
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }
      const token = jwt.sign({ userId: user.id, email }, JWT_SECRET)
      return NextResponse.json({ token, userId: user.id, name: user.name })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
