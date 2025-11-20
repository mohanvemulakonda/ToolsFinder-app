import { NextResponse } from 'next/server'
const pool = require('../../../lib/db')

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const manufacturer = searchParams.get('manufacturer')
    const material = searchParams.get('material')
    const minDiameter = searchParams.get('minDiameter')
    const maxDiameter = searchParams.get('maxDiameter')

    let query = `
      SELECT
        t.*,
        s.name as supplier_name,
        s.website as supplier_website
      FROM Tool t
      LEFT JOIN Supplier s ON t.supplierId = s.id
      WHERE 1=1
    `
    let params = []

    if (search) {
      query += ' AND (t.name LIKE ? OR t.description LIKE ? OR t.partNumber LIKE ? OR t.type LIKE ?)'
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (category) {
      query += ' AND t.type = ?'
      params.push(category)
    }

    if (manufacturer) {
      query += ' AND t.supplierId = ?'
      params.push(manufacturer)
    }

    if (minDiameter) {
      query += ' AND t.diameter >= ?'
      params.push(minDiameter)
    }

    if (maxDiameter) {
      query += ' AND t.diameter <= ?'
      params.push(maxDiameter)
    }

    query += ' ORDER BY t.name ASC LIMIT 100'

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
