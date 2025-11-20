import { NextResponse } from 'next/server'
const pool = require('../../../lib/db')

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    let query = ''

    switch (type) {
      case 'manufacturers':
        query = 'SELECT id, name, code, logo_url, country FROM Manufacturer ORDER BY name'
        break
      case 'categories':
        query = 'SELECT id, name, code, description FROM ToolCategory ORDER BY name'
        break
      case 'substrates':
        query = 'SELECT id, name, code, description FROM Substrate ORDER BY name'
        break
      case 'coatings':
        query = 'SELECT id, name, code, color FROM Coating ORDER BY name'
        break
      case 'materials':
        query = 'SELECT id, iso_code, name, color, description FROM WorkpieceMaterial ORDER BY iso_code'
        break
      case 'operations':
        query = 'SELECT id, name, code FROM OperationType ORDER BY name'
        break
      case 'coolants':
        query = 'SELECT id, name, code FROM CoolantType ORDER BY name'
        break
      case 'all':
        // Return all lookups in one call
        const [manufacturers] = await pool.execute('SELECT id, name, code FROM Manufacturer ORDER BY name')
        const [categories] = await pool.execute('SELECT id, name, code FROM ToolCategory ORDER BY name')
        const [substrates] = await pool.execute('SELECT id, name, code FROM Substrate ORDER BY name')
        const [coatings] = await pool.execute('SELECT id, name, code, color FROM Coating ORDER BY name')
        const [materials] = await pool.execute('SELECT id, iso_code, name, color FROM WorkpieceMaterial ORDER BY iso_code')
        const [operations] = await pool.execute('SELECT id, name, code FROM OperationType ORDER BY name')
        const [coolants] = await pool.execute('SELECT id, name, code FROM CoolantType ORDER BY name')

        return NextResponse.json({
          manufacturers,
          categories,
          substrates,
          coatings,
          materials,
          operations,
          coolants
        })
      default:
        return NextResponse.json({ error: 'Invalid lookup type' }, { status: 400 })
    }

    const [data] = await pool.execute(query)
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
