'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [tools, setTools] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async (query = '') => {
    setLoading(true)
    try {
      const url = query ? '/api/tools?search=' + query : '/api/tools'
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

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          <span className="text-blue-500">Tools</span>Finder
        </h1>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="flex-1 p-3 rounded bg-gray-900 border border-gray-700 text-white"
            />
            <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold">
              Search
            </button>
          </div>
        </form>
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div key={tool.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-amber-500">{tool.name}</h3>
                <p className="text-gray-400 mt-2">{tool.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{tool.category}</span>
                  <span className="text-lg font-bold text-blue-500">${tool.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
