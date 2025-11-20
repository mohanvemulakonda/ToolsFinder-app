'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Library() {
  const router = useRouter()
  const [library, setLibrary] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/login')
      return
    }
    fetchLibrary()
  }, [router])

  const fetchLibrary = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const res = await fetch(`/api/library?userId=${userId}`)
      const data = await res.json()
      setLibrary(data.library || [])
    } catch (error) {
      console.error('Failed to fetch library:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromLibrary = async (id) => {
    try {
      await fetch(`/api/library?id=${id}`, { method: 'DELETE' })
      setLibrary(library.filter(item => item.id !== id))
    } catch (error) {
      console.error('Failed to remove from library:', error)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          My <span className="text-amber-500">Library</span>
        </h1>

        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : library.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Your library is empty</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Browse Tools
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {library.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800"
              >
                <h3 className="text-xl font-semibold text-amber-500 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {item.description || 'No description'}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 block">{item.category}</span>
                    {item.price && (
                      <span className="text-lg font-bold text-blue-500">${item.price}</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromLibrary(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition"
                  >
                    Remove
                  </button>
                </div>
                {item.notes && (
                  <p className="mt-3 text-sm text-gray-500 border-t border-gray-800 pt-3">
                    Note: {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
