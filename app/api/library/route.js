import { NextResponse } from 'next/server'
const pool = require('../../../lib/db')

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    
    const [items] = await pool.execute(
      `SELECT l.*, t.name, t.description, t.category, t.price
       FROM LibraryItem l
       JOIN Tool t ON l.toolId = t.id
       WHERE l.userId = ?`,
      [userId]
    )
    
    return NextResponse.json({ library: items })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, tool_id, notes } = body
    
    const [result] = await pool.execute(
      'INSERT INTO LibraryItem (userId, toolId, notes) VALUES (?, ?, ?)',
      [user_id, tool_id, notes || null]
    )
    
    return NextResponse.json({ id: result.insertId, message: 'Added to library' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    await pool.execute('DELETE FROM LibraryItem WHERE id = ?', [id])
    return NextResponse.json({ message: 'Removed from library' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
