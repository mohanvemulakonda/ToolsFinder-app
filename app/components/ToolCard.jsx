'use client'

export default function ToolCard({ tool, onAddToLibrary, adding }) {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 hover:border-blue-500 transition group overflow-hidden">
      {tool.image_url ? (
        <div className="h-48 bg-gray-800 flex items-center justify-center">
          <img src={tool.image_url} alt={tool.name} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="h-48 bg-gray-800 flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-amber-500 group-hover:text-amber-400 line-clamp-1">
            {tool.name}
          </h3>
          {tool.brand && (
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded ml-2 whitespace-nowrap">
              {tool.brand}
            </span>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
          {tool.description || 'No description available'}
        </p>

        <div className="flex justify-between items-center pt-3 border-t border-gray-800">
          <div>
            {tool.category && (
              <span className="text-xs text-gray-500 block mb-1">{tool.category}</span>
            )}
            {tool.price ? (
              <span className="text-xl font-bold text-blue-500">${Number(tool.price).toFixed(2)}</span>
            ) : (
              <span className="text-sm text-gray-500">Price on request</span>
            )}
          </div>
          <button
            onClick={() => onAddToLibrary(tool.id)}
            disabled={adding === tool.id}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding === tool.id ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
            ) : (
              '+ Add'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
