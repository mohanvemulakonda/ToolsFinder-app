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
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#000' }}>
        ToolsFinder
      </h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Search industrial tools from verified suppliers
      </p>

      <form onSubmit={searchTools} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for tools..."
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {tools.map((tool) => (
          <div
            key={tool.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                {tool.name}
              </h3>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>
                {tool.category} • {tool.supplier}
              </p>
            </div>
            <button
              onClick={() => addToLibrary(tool.id)}
              style={{
                background: '#f59e0b',
                color: '#000',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Add to Library
            </button>
          </div>
        ))}
      </div>

      {tools.length === 0 && query && !loading && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No tools found. Try a different search term.
        </p>
      )}
    </main>
  );
}
