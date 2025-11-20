import { NextResponse } from 'next/server'
const pool = require('../../../lib/db')

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    let query = 'SELECT * FROM Tool'
    let params = []
    
    if (search) {
      query += ' WHERE name LIKE ? OR description LIKE ? OR category LIKE ?'
      params = [`%${search}%`, `%${search}%`, `%${search}%`]
    }
    
    const [tools] = await pool.execute(query, params)
    return NextResponse.json({ tools })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, description, category, brand, price, image_url } = body
    
    const [result] = await pool.execute(
      'INSERT INTO Tool (name, description, category, brand, price, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, category, brand, price, image_url]
    )
    
    return NextResponse.json({ id: result.insertId, message: 'Tool created' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
