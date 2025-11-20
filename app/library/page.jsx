'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Library() {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      // In production, get userId from auth context
      const userId = localStorage.getItem('userId') || '1';
      const res = await fetch(`/api/library?userId=${userId}`);
      const data = await res.json();
      setLibrary(data.library || []);
    } catch (error) {
      console.error('Failed to fetch library:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromLibrary = async (toolId) => {
    try {
      const userId = localStorage.getItem('userId') || '1';
      await fetch(`/api/library?userId=${userId}&toolId=${toolId}`, {
        method: 'DELETE'
      });
      setLibrary(library.filter(item => item.tool_id !== toolId));
    } catch (error) {
      console.error('Failed to remove from library:', error);
    }
  };

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#000' }}>My Library</h1>
        <Link href="/" style={{ color: '#2563EB', textDecoration: 'none' }}>
          ← Back to Search
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : library.length === 0 ? (
        <p style={{ color: '#666' }}>Your library is empty. Start by searching for tools!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {library.map((item) => (
            <div
              key={item.tool_id}
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
                <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</h3>
                <p style={{ color: '#666', fontSize: '0.875rem' }}>{item.category}</p>
                {item.price && (
                  <p style={{ color: '#2563EB', fontWeight: '500', marginTop: '0.25rem' }}>
                    ${item.price}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeFromLibrary(item.tool_id)}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
