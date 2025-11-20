'use client'

export default function SearchFilters({ categories, selectedCategory, onCategoryChange, sortBy, onSortChange }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2">
        <label className="text-gray-500 text-sm">CATEGORY:</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-black border border-gray-800 text-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-gray-500 text-sm">SORT:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-black border border-gray-800 text-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="name">Name</option>
          <option value="price_low">Price: Low-High</option>
          <option value="price_high">Price: High-Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  )
}
