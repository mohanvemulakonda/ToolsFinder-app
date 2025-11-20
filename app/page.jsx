'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [tools, setTools] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [addingToLibrary, setAddingToLibrary] = useState(null)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async (query = '') => {
    setLoading(true)
    try {
      const url = query ? `/api/tools?search=${encodeURIComponent(query)}` : '/api/tools'
      const res = await fetch(url)
      const data = await res.json()
      setTools(data.tools || [])
    } catch (err) {
      console.error('Error fetching tools:', err)
    }
    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchTools(search)
  }

  const addToLibrary = async (toolId) => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('Please login to add tools to your library')
      return
    }

    setAddingToLibrary(toolId)
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, tool_id: toolId })
      })

      if (res.ok) {
        alert('Added to library!')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to add to library')
      }
    } catch (err) {
      alert('Failed to add to library')
    }
    setAddingToLibrary(null)
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Find Your <span className="text-amber-500">Perfect Tool</span>
          </h1>
          <p className="text-gray-400">Search through thousands of industrial tools</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, or description..."
              className="flex-1 p-4 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-2">Loading tools...</p>
          </div>
        ) : tools.length === 0 ? (
          <p className="text-center text-gray-400">No tools found. Try a different search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-blue-500 transition group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-amber-500 group-hover:text-amber-400">
                    {tool.name}
                  </h3>
                  {tool.brand && (
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                      {tool.brand}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {tool.description || 'No description available'}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 block">{tool.category}</span>
                    {tool.price && (
                      <span className="text-lg font-bold text-blue-500">${tool.price}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToLibrary(tool.id)}
                    disabled={addingToLibrary === tool.id}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition disabled:opacity-50"
                  >
                    {addingToLibrary === tool.id ? '...' : '+ Library'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Found {tools.length} tools</p>
        </div>
      </div>
    </main>
  )
}
