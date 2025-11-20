'use client'

import { useState } from 'react'

export default function CADDownloadButton({ insertCode, className = '' }) {
  const [loading, setLoading] = useState(false)
  const [format, setFormat] = useState('step')
  const [error, setError] = useState(null)

  // Extract insert code from product name (e.g., "Sandvik CNMG 120408-PM GC4225" -> "CNMG120408")
  const extractInsertCode = (name) => {
    if (!name) return null
    const match = name.match(/([CDSTVWRH][A-Z]{3})\s*(\d{6})/i)
    return match ? `${match[1]}${match[2]}` : null
  }

  const code = insertCode || extractInsertCode(insertCode)

  const handleDownload = async () => {
    if (!code) {
      setError('Invalid insert code')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/cad/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          format: format,
          branding: true
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Download failed')
      }

      // Download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ToolsFinder_${code}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!code) return null

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="bg-black border border-zinc-700 text-white text-sm px-2 py-1.5 focus:border-blue-600 outline-none"
        >
          <option value="step">STEP</option>
          <option value="stl">STL</option>
        </select>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download 3D CAD
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
      <p className="text-zinc-500 text-xs">
        Parametric 3D model with ToolsFinder branding
      </p>
    </div>
  )
}
