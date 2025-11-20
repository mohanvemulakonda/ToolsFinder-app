'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('userName')
    if (token && name) {
      setUser({ name })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            <span className="text-lg font-bold text-white">
              TOOLS<span className="text-blue-500">FINDER</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-blue-500 transition text-sm font-medium">
              SEARCH
            </Link>
            <Link href="/suppliers" className="text-gray-400 hover:text-blue-500 transition text-sm font-medium">
              SUPPLIERS
            </Link>
            <Link href="/library" className="text-gray-400 hover:text-blue-500 transition text-sm font-medium">
              LIBRARY
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-amber-500 text-sm">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-900 border border-gray-800 text-white px-4 py-2 hover:border-blue-500 transition text-sm"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition text-sm font-medium"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
