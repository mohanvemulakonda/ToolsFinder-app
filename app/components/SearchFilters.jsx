'use client'

export default function SearchFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  brands,
  selectedBrand,
  onBrandChange,
  sortBy,
  onSortChange
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 p-4 mb-6 relative z-10">
      <div className="flex flex-wrap gap-6 items-center">
        {/* Tool Type / Category */}
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm font-medium">Type:</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none min-w-[140px]"
          >
            <option value="">All Types</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Manufacturer / Brand */}
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm font-medium">Manufacturer:</label>
          <select
            value={selectedBrand || ''}
            onChange={(e) => onBrandChange && onBrandChange(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none min-w-[140px]"
          >
            <option value="">All Manufacturers</option>
            {brands && brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-gray-600 text-sm font-medium">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none min-w-[140px]"
          >
            <option value="name">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
            <option value="price_low">Price: Low-High</option>
            <option value="price_high">Price: High-Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>
    </div>
  )
}
