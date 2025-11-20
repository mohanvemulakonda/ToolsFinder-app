'use client'
import { useState, useEffect } from 'react'
import ToolCard from './components/ToolCard'
import SearchFilters from './components/SearchFilters'

export default function Home() {
  const [tools, setTools] = useState([])
  const [filteredTools, setFilteredTools] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [addingToLibrary, setAddingToLibrary] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchTools()
  }, [])

  useEffect(() => {
    filterAndSortTools()
  }, [tools, selectedCategory, sortBy])

  const fetchTools = async (query = '') => {
    setLoading(true)
    try {
      const url = query ? `/api/tools?search=${encodeURIComponent(query)}` : '/api/tools'
      const res = await fetch(url)
      const data = await res.json()
      const toolsData = data.tools || []
      setTools(toolsData)

      const cats = [...new Set(toolsData.map(t => t.category).filter(Boolean))]
      setCategories(cats)
    } catch (err) {
      console.error('Error fetching tools:', err)
    }
    setLoading(false)
  }

  const filterAndSortTools = () => {
    let result = [...tools]

    if (selectedCategory) {
      result = result.filter(t => t.category === selectedCategory)
    }

    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price_high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      default:
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }

    setFilteredTools(result)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchTools(search)
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const addToLibrary = async (toolId) => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      showMessage('Please login to add tools to your library', 'error')
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
        showMessage('Added to library!')
      } else {
        const data = await res.json()
        showMessage(data.error || 'Failed to add to library', 'error')
      }
    } catch (err) {
      showMessage('Failed to add to library', 'error')
    }
    setAddingToLibrary(null)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Find Your <span className="text-amber-500">Perfect Tool</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Search through thousands of industrial cutting tools and inserts
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, category, or description..."
                  className="w-full p-4 pl-12 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none text-lg"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition text-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          message.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tools Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!loading && tools.length > 0 && (
          <SearchFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading tools...</p>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-lg">No tools found</p>
            <p className="text-gray-500 mt-2">Try a different search term or category</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400">
                Showing <span className="text-white font-semibold">{filteredTools.length}</span> tools
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onAddToLibrary={addToLibrary}
                  adding={addingToLibrary}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
