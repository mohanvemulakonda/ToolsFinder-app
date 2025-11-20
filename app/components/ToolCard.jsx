'use client'

export default function ToolCard({ tool, onAddToLibrary, adding }) {
  return (
    <div className="bg-gray-900 border border-gray-800 hover:border-blue-600 transition group overflow-hidden">
      {/* Image placeholder with icon */}
      <div className="h-40 bg-black flex items-center justify-center border-b border-gray-800">
        {tool.image_url ? (
          <img src={tool.image_url} alt={tool.name} className="h-full w-full object-cover" />
        ) : (
          <svg className="w-12 h-12 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        )}
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-base font-semibold text-white group-hover:text-blue-500 transition line-clamp-1">
            {tool.name}
          </h3>
          {tool.brand && (
            <span className="text-xs bg-black text-gray-500 px-2 py-1 border border-gray-800 ml-2 whitespace-nowrap">
              {tool.brand}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
          {tool.description || 'No description available'}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-800">
          <div>
            {tool.category && (
              <span className="text-xs text-gray-600 block mb-1">{tool.category}</span>
            )}
            {tool.price ? (
              <span className="text-lg font-bold text-blue-500">${Number(tool.price).toFixed(2)}</span>
            ) : (
              <span className="text-sm text-gray-600">Request price</span>
            )}
          </div>
          <button
            onClick={() => onAddToLibrary(tool.id)}
            disabled={adding === tool.id}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding === tool.id ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'ADD'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
