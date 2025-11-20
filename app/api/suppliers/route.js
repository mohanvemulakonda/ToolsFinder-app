import { NextResponse } from 'next/server'
const pool = require('../../../lib/db')

export async function GET() {
  try {
    const [suppliers] = await pool.execute('SELECT * FROM suppliers')
    return NextResponse.json({ suppliers })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, address, website } = body
    
    const [result] = await pool.execute(
      'INSERT INTO suppliers (name, email, phone, address, website) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, address, website]
    )
    
    return NextResponse.json({ id: result.insertId, message: 'Supplier created' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
