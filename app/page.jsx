'use client'
import { useState, useEffect } from 'react'
import ToolCard from './components/ToolCard'
import SearchFilters from './components/SearchFilters'

export default function Home() {
  const [tools, setTools] = useState([])
  const [filteredTools, setFilteredTools] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [addingToLibrary, setAddingToLibrary] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [message, setMessage] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Live search - debounced
  useEffect(() => {
    if (search.trim().length >= 1) {
      const timer = setTimeout(() => {
        setHasSearched(true)
        fetchTools(search)
      }, 300) // 300ms debounce
      return () => clearTimeout(timer)
    } else if (search.trim().length === 0 && hasSearched) {
      setTools([])
      setFilteredTools([])
    }
  }, [search])

  useEffect(() => {
    filterAndSortTools()
  }, [tools, selectedCategory, selectedBrand, sortBy])

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

      const brandList = [...new Set(toolsData.map(t => t.brand).filter(Boolean))]
      setBrands(brandList)
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

    if (selectedBrand) {
      result = result.filter(t => t.brand === selectedBrand)
    }

    switch (sortBy) {
      case 'name_desc':
        result.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
        break
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
    // Form submit is now optional since we have live search
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
    <main className="min-h-screen bg-white text-gray-900">
      {/* Search Section - Centered when no search, top when results */}
      <div className={`bg-gray-50 border-b border-gray-200 px-4 transition-all duration-500 ease-in-out ${
        hasSearched ? 'py-6' : 'py-32 min-h-[60vh] flex items-center'
      }`}>
        <div className={`max-w-4xl mx-auto text-center transition-all duration-500 ${
          hasSearched ? '' : 'transform'
        }`}>
          <h1 className={`font-light text-gray-900 transition-all duration-500 ${
            hasSearched ? 'text-2xl mb-2' : 'text-5xl mb-4'
          }`}>
            Find Your <span className="font-semibold text-blue-600">Perfect Tool</span>
          </h1>
          <p className={`text-gray-500 transition-all duration-500 ${
            hasSearched ? 'text-sm mb-4' : 'text-lg mb-8'
          }`}>
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
                  className={`w-full pl-12 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 ${
                    hasSearched ? 'p-3 text-sm' : 'p-4 text-base'
                  }`}
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {loading && (
                <div className={`flex items-center justify-center ${hasSearched ? 'px-6' : 'px-8'}`}>
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </form>

          {!hasSearched && (
            <div className="mt-12 text-gray-400 text-sm">
              <p>Try searching for: <span className="text-gray-600">CNMG, CoroMill, End Mill, Insert</span></p>
            </div>
          )}
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-20 right-4 px-6 py-3 shadow-lg z-50 ${
          message.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tools Section - Only show after search */}
      {hasSearched && (
        <div className="max-w-7xl mx-auto px-4 py-8 relative">
          {/* Background Logo + Text Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.05]">
            <div className="flex items-center">
              <img
                src="/images/logo/toolsfinder-icon.svg"
                alt=""
                className="w-48 h-48 -mr-8"
              />
              <span className="text-[120px] text-gray-900 whitespace-nowrap select-none leading-none">
                <span className="font-light">Tools</span><span className="font-semibold">Finder</span><span className="font-semibold">.io</span>
              </span>
            </div>
          </div>
          {!loading && tools.length > 0 && (
            <SearchFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              brands={brands}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-500 mt-4">Searching tools...</p>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-lg">No tools found for "{search}"</p>
              <p className="text-gray-400 mt-2">Try a different search term</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-500">
                  Showing <span className="text-gray-900 font-semibold">{filteredTools.length}</span> tools for "<span className="text-blue-600">{search}</span>"
                </p>
              </div>

              {/* List View Table */}
              <div className="bg-white border border-gray-200 overflow-hidden relative z-10">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                  <div className="col-span-4">Tool Name</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Manufacturer</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                {/* Table Rows */}
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="border-b border-gray-100 px-4 py-3 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition"
                  >
                    {/* Tool Name */}
                    <div className="col-span-4">
                      <h3 className="text-sm font-medium text-gray-900">{tool.name}</h3>
                      {tool.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{tool.description}</p>
                      )}
                    </div>

                    {/* Type/Category */}
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">{tool.category || '-'}</span>
                    </div>

                    {/* Manufacturer with Logo */}
                    <div className="col-span-2 flex items-center gap-2">
                      {tool.brand && (
                        <>
                          <img
                            src={`/images/manufacturers/${tool.brand.toLowerCase().replace(/\s+/g, '-')}.png`}
                            alt={tool.brand}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                          <span className="text-sm text-gray-600">{tool.brand}</span>
                        </>
                      )}
                      {!tool.brand && <span className="text-sm text-gray-400">-</span>}
                    </div>

                    {/* Price */}
                    <div className="col-span-2">
                      {tool.price ? (
                        <span className="text-sm font-semibold text-blue-600">${Number(tool.price).toFixed(2)}</span>
                      ) : (
                        <span className="text-xs text-gray-500">Request price</span>
                      )}
                    </div>

                    {/* Action */}
                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => addToLibrary(tool.id)}
                        disabled={addingToLibrary === tool.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-medium transition disabled:opacity-50"
                      >
                        {addingToLibrary === tool.id ? (
                          <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          'Add to Library'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  )
}
