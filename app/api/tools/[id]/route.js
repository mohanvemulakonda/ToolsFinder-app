import { NextResponse } from 'next/server'
const pool = require('../../../../lib/db')

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const [tools] = await pool.execute(
      `SELECT
        t.*,
        s.name as supplier_name,
        s.website as supplier_website,
        s.logo_url as supplier_logo
      FROM Tool t
      LEFT JOIN Supplier s ON t.supplierId = s.id
      WHERE t.id = ?`,
      [id]
    )

    if (tools.length === 0) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
    }

    return NextResponse.json({ tool: tools[0] })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
