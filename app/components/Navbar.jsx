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
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-blue-500">Tools</span>
              <span className="text-white">Finder</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white transition">
              Search
            </Link>
            <Link href="/suppliers" className="text-gray-300 hover:text-white transition">
              Suppliers
            </Link>
            <Link href="/library" className="text-gray-300 hover:text-white transition">
              My Library
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-amber-500">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
