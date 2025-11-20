'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchTools = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/tools?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setTools(data.tools || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToLibrary = async (toolId) => {
    try {
      await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId })
      });
      alert('Added to library!');
    } catch (error) {
      console.error('Failed to add to library:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-[#000000] text-white py-8 border-b border-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-light mb-2">
            Tools<span className="font-semibold">Finder</span><span className="font-semibold text-[#f59e0b]">.io</span>
          </h1>
          <p className="text-[#9CA3AF] text-sm uppercase tracking-wider font-light">
            connect.discover.build
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-light text-[#111827] mb-2">
            Search Industrial Tools
          </h2>
          <p className="text-[#6B7280] text-sm">
            Find tools from verified suppliers worldwide
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={searchTools} className="mb-12">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for tools..."
              className="flex-1 px-4 py-3 border-2 border-[#E2E8F0] bg-white text-[#111827] placeholder-[#9CA3AF] focus:border-[#2563EB] focus:outline-none transition-colors duration-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#000000] text-white font-medium hover:bg-[#2563EB] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="space-y-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white border border-[#E2E8F0] p-6 flex justify-between items-center hover:border-[#2563EB] transition-colors duration-300"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#111827] mb-1">
                  {tool.name}
                </h3>
                <p className="text-sm text-[#6B7280]">
                  {tool.category} {tool.supplier && `• ${tool.supplier}`}
                </p>
                {tool.description && (
                  <p className="text-sm text-[#9CA3AF] mt-2">{tool.description}</p>
                )}
              </div>
              <button
                onClick={() => addToLibrary(tool.id)}
                className="px-4 py-2 bg-[#f59e0b] text-[#000000] font-medium hover:bg-[#d97706] transition-colors duration-300"
              >
                Add to Library
              </button>
            </div>
          ))}
        </div>

        {tools.length === 0 && query && !loading && (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">No tools found. Try a different search term.</p>
          </div>
        )}

        {tools.length === 0 && !query && (
          <div className="text-center py-12 bg-white border border-[#E2E8F0]">
            <svg className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-[#6B7280] font-light">Enter a search term to find tools</p>
          </div>
        )}
      </main>
    </div>
  );
}
