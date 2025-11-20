'use client'
import { useState } from 'react'

export default function SearchFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  brands,
  selectedBrand,
  onBrandChange,
  sortBy,
  onSortChange,
  // New advanced filters
  substrates,
  selectedSubstrate,
  onSubstrateChange,
  coatings,
  selectedCoating,
  onCoatingChange,
  minDiameter,
  maxDiameter,
  onDiameterChange
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="bg-gray-50 border border-gray-200 p-4 mb-6 relative z-10">
      {/* Primary Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Tool Type / Category */}
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-xs font-medium">Type:</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none min-w-[120px]"
          >
            <option value="">All Types</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Manufacturer / Brand */}
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-xs font-medium">Manufacturer:</label>
          <select
            value={selectedBrand || ''}
            onChange={(e) => onBrandChange && onBrandChange(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none min-w-[120px]"
          >
            <option value="">All</option>
            {brands && brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Substrate */}
        {substrates && (
          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-xs font-medium">Substrate:</label>
            <select
              value={selectedSubstrate || ''}
              onChange={(e) => onSubstrateChange && onSubstrateChange(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none min-w-[100px]"
            >
              <option value="">All</option>
              {substrates.map((sub) => (
                <option key={sub.id || sub} value={sub.id || sub}>{sub.name || sub}</option>
              ))}
            </select>
          </div>
        )}

        {/* Coating */}
        {coatings && (
          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-xs font-medium">Coating:</label>
            <select
              value={selectedCoating || ''}
              onChange={(e) => onCoatingChange && onCoatingChange(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none min-w-[100px]"
            >
              <option value="">All</option>
              {coatings.map((coat) => (
                <option key={coat.id || coat} value={coat.id || coat}>{coat.name || coat}</option>
              ))}
            </select>
          </div>
        )}

        {/* Diameter Range */}
        {onDiameterChange && (
          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-xs font-medium">Ø (mm):</label>
            <input
              type="number"
              placeholder="Min"
              value={minDiameter || ''}
              onChange={(e) => onDiameterChange('min', e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none w-16"
              step="0.1"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxDiameter || ''}
              onChange={(e) => onDiameterChange('max', e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none w-16"
              step="0.1"
            />
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-gray-600 text-xs font-medium">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none min-w-[120px]"
          >
            <option value="name">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
            <option value="price_low">Price: Low-High</option>
            <option value="price_high">Price: High-Low</option>
            <option value="diameter_asc">Diameter: Small-Large</option>
            <option value="diameter_desc">Diameter: Large-Small</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>
    </div>
  )
}
