'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [unit, setUnit] = useState('metric')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('userName')
    const savedUnit = localStorage.getItem('unit') || 'metric'
    if (token && name) {
      setUser({ name })
    }
    setUnit(savedUnit)
  }, [])

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit)
    localStorage.setItem('unit', newUnit)
  }

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
            <img
              src="/images/logo/toolsfinder-icon.svg"
              alt="ToolsFinder"
              className="h-12 w-12"
            />
            <div className="flex flex-col -ml-1">
              <span className="text-xl font-light text-white">
                Tools<span className="font-semibold">Finder</span><span className="font-semibold text-amber-500">.io</span>
              </span>
              <span className="text-[0.6rem] text-gray-500 uppercase tracking-widest font-light">
                find.compare.manufacture
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-blue-500 transition text-sm font-medium">
              Search
            </Link>
            <Link href="/library" className="text-gray-400 hover:text-blue-500 transition text-sm font-medium">
              Library
            </Link>
            <Link href="/compare" className="text-gray-400 hover:text-blue-500 transition text-sm font-medium">
              Compare
            </Link>

            {/* Unit Toggle */}
            <div className="flex items-center bg-gray-900 rounded-sm border border-gray-700">
              <button
                onClick={() => handleUnitChange('metric')}
                className={`px-3 py-1.5 text-xs font-medium transition ${
                  unit === 'metric'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Metric
              </button>
              <button
                onClick={() => handleUnitChange('imperial')}
                className={`px-3 py-1.5 text-xs font-medium transition ${
                  unit === 'imperial'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Imperial
              </button>
            </div>

            {/* Settings */}
            <Link href="/settings" className="text-gray-400 hover:text-blue-500 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-amber-500 text-sm font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-1.5 hover:bg-blue-700 transition text-sm font-medium"
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
