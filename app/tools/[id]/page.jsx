'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ToolDetails() {
  const params = useParams()
  const router = useRouter()
  const [tool, setTool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('specs')
  const viewerRef = useRef(null)

  useEffect(() => {
    if (params.id) {
      fetchTool()
    }
  }, [params.id])

  const fetchTool = async () => {
    try {
      const res = await fetch(`/api/tools/${params.id}`)
      const data = await res.json()

      if (res.ok) {
        setTool(data.tool)
      } else {
        setError(data.error || 'Tool not found')
      }
    } catch (err) {
      setError('Failed to load tool')
    }
    setLoading(false)
  }

  const addToLibrary = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, tool_id: tool.id })
      })

      if (res.ok) {
        alert('Added to library!')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to add')
      }
    } catch (err) {
      alert('Failed to add to library')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Tool Not Found</h1>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">Back to search</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <p className="text-xs text-gray-400 font-mono">{tool.partNumber}</p>
            <h1 className="text-xl font-semibold text-gray-900">{tool.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: 3D Viewer / Image */}
          <div>
            <div className="bg-gray-100 border border-gray-200 aspect-square flex items-center justify-center relative">
              {tool.stepFile || tool.igesFile || tool.has3DModel ? (
                <div ref={viewerRef} className="w-full h-full">
                  {/* 3D Viewer placeholder - will integrate Three.js */}
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                    <p className="text-gray-500 mb-2">3D Model Available</p>
                    <div className="flex gap-2">
                      {tool.stepFile && (
                        <a href={tool.stepFile} download className="bg-blue-600 text-white px-3 py-1.5 text-xs hover:bg-blue-700">
                          Download STEP
                        </a>
                      )}
                      {tool.igesFile && (
                        <a href={tool.igesFile} download className="bg-gray-600 text-white px-3 py-1.5 text-xs hover:bg-gray-700">
                          Download IGES
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : tool.thumbnail ? (
                <img src={tool.thumbnail} alt={tool.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="w-24 h-24 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No image available</p>
                </div>
              )}
            </div>

            {/* Download buttons */}
            {tool.pdfDatasheet && (
              <a href={tool.pdfDatasheet} download className="mt-4 w-full bg-gray-100 border border-gray-200 py-3 text-center block text-gray-700 hover:bg-gray-200">
                Download PDF Datasheet
              </a>
            )}
          </div>

          {/* Right: Details */}
          <div>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {['specs', 'cutting', 'documents'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'cutting' ? 'Cutting Data' : tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <SpecItem label="Type" value={tool.type} />
                  <SpecItem label="Application" value={tool.application} />
                  <SpecItem label="Diameter" value={tool.diameter ? `${Number(tool.diameter).toFixed(2)} mm` : null} />
                  <SpecItem label="Length" value={tool.length ? `${Number(tool.length).toFixed(2)} mm` : null} />
                  <SpecItem label="Corner Radius" value={tool.cornerRadius ? `R${Number(tool.cornerRadius).toFixed(2)}` : null} />
                  <SpecItem label="Insert Angle" value={tool.insertAngle ? `${tool.insertAngle}°` : null} />
                  <SpecItem label="Thickness" value={tool.thickness ? `${tool.thickness} mm` : null} />
                  <SpecItem label="Manufacturer" value={tool.supplier_name} />
                </div>

                {tool.description && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </div>
                )}

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.has3DModel && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 text-xs">3D Model</span>
                    )}
                    {tool.hasSpeedsFeeds && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs">Speeds & Feeds</span>
                    )}
                    {tool.hasGeometry && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 text-xs">Geometry Data</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cutting' && (
              <div className="text-center py-12 text-gray-500">
                {tool.hasSpeedsFeeds ? (
                  <div className="space-y-4">
                    <p className="text-sm">Cutting data available for this tool</p>
                    <p className="text-xs text-gray-400">Speeds and feeds recommendations coming soon</p>
                  </div>
                ) : (
                  <p>No cutting data available</p>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-3">
                {tool.pdfDatasheet && (
                  <DocumentLink label="PDF Datasheet" url={tool.pdfDatasheet} />
                )}
                {tool.stepFile && (
                  <DocumentLink label="STEP File" url={tool.stepFile} />
                )}
                {tool.igesFile && (
                  <DocumentLink label="IGES File" url={tool.igesFile} />
                )}
                {!tool.pdfDatasheet && !tool.stepFile && !tool.igesFile && (
                  <p className="text-center py-8 text-gray-500">No documents available</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={addToLibrary}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium transition"
              >
                Add to My Library
              </button>
              {tool.supplier_website && (
                <a
                  href={tool.supplier_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full border border-gray-300 py-3 text-center block text-gray-700 hover:bg-gray-50"
                >
                  Visit Manufacturer Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function SpecItem({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}

function DocumentLink({ label, url }) {
  return (
    <a
      href={url}
      download
      className="flex items-center justify-between p-3 border border-gray-200 hover:bg-gray-50"
    >
      <span className="text-sm text-gray-700">{label}</span>
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </a>
  )
}
