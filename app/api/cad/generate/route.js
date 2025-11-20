import { NextResponse } from 'next/server'

// CAD Generation API - proxies to Python CadQuery service
const CAD_SERVICE_URL = process.env.CAD_SERVICE_URL || 'http://localhost:5001'

export async function POST(request) {
  try {
    const data = await request.json()

    if (!data.code) {
      return NextResponse.json({ error: 'Insert code required' }, { status: 400 })
    }

    // Forward request to Python CAD service
    const response = await fetch(`${CAD_SERVICE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: data.code,
        format: data.format || 'step',
        branding: data.branding !== false // Default to true
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    // Stream the file back
    const blob = await response.blob()
    const filename = `ToolsFinder_${data.code.replace(/\s/g, '_')}.${data.format || 'step'}`

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error('CAD generation error:', error)
    return NextResponse.json(
      { error: 'CAD service unavailable. Make sure the Python service is running on port 5001.' },
      { status: 503 }
    )
  }
}

export async function GET() {
  // Health check - verify CAD service is running
  try {
    const response = await fetch(`${CAD_SERVICE_URL}/health`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'CAD service not running' },
      { status: 503 }
    )
  }
}
