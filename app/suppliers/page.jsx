'use client'
import { useState, useEffect } from 'react'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/suppliers')
      const data = await res.json()
      setSuppliers(data.suppliers || [])
    } catch (err) {
      console.error('Error fetching suppliers:', err)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          <span className="text-amber-500">Suppliers</span>
        </h1>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : suppliers.length === 0 ? (
          <p className="text-gray-400">No suppliers found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-blue-500 transition"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{supplier.name}</h3>
                {supplier.email && (
                  <p className="text-gray-400 text-sm mb-1">
                    <span className="text-blue-500">Email:</span> {supplier.email}
                  </p>
                )}
                {supplier.phone && (
                  <p className="text-gray-400 text-sm mb-1">
                    <span className="text-blue-500">Phone:</span> {supplier.phone}
                  </p>
                )}
                {supplier.website && (
                  <a
                    href={supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-amber-500 hover:text-amber-400 text-sm"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
