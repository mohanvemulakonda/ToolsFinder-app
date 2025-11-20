import { NextResponse } from 'next/server'
const pool = require('../../../lib/db')

// Import tools from CSV/JSON data
export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let tools = []

    if (contentType.includes('application/json')) {
      const data = await request.json()
      tools = Array.isArray(data) ? data : data.tools || []
    } else {
      // Parse CSV
      const text = await request.text()
      const lines = text.split('\n').filter(l => l.trim())
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
        const tool = {}
        headers.forEach((h, idx) => {
          tool[h] = values[idx] || ''
        })
        tools.push(tool)
      }
    }

    if (tools.length === 0) {
      return NextResponse.json({ error: 'No tools to import' }, { status: 400 })
    }

    let inserted = 0
    const batchSize = 100

    for (let i = 0; i < tools.length; i += batchSize) {
      const batch = tools.slice(i, i + batchSize)
      const placeholders = batch.map(() => '(?, ?, ?, ?, ?)').join(', ')
      const values = batch.flatMap(t => [
        t.name || 'Unknown Tool',
        t.description || '',
        t.category || 'Uncategorized',
        t.brand || 'Unknown',
        parseFloat(t.price) || 0
      ])

      await pool.execute(
        `INSERT INTO Tool (name, description, category, brand, price) VALUES ${placeholders}`,
        values
      )
      inserted += batch.length
    }

    const [result] = await pool.execute('SELECT COUNT(*) as count FROM Tool')

    return NextResponse.json({
      success: true,
      imported: inserted,
      total: result[0].count
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Get import template
export async function GET() {
  const template = `name,description,category,brand,price
"CNMG 120408-PM 4325","Sandvik turning insert for steel","Turning Inserts","Sandvik",24.99
"TNMG 160404-MF KC5010","Kennametal finishing insert","Turning Inserts","Kennametal",19.99
"APKT 1003PDR IC928","Iscar milling insert","Milling Inserts","Iscar",32.50`

  return new NextResponse(template, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="tools-template.csv"'
    }
  })
}
