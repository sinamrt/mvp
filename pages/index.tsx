// pages/index.tsx

import { useState } from 'react';

type Place = {
  name: string;
  rating: number;
  types?: string[];
};

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (res.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🔍 Search Places</h1>

      <input
        type="text"
        placeholder="e.g., restaurants in Sydney"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '0.5rem', width: '300px' }}
      />
      <button onClick={handleSearch} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ marginTop: '2rem' }}>
        {results.map((place, index) => (
          <li key={index} style={{ marginBottom: '1rem' }}>
            <strong>{place.name}</strong> — ⭐ {place.rating}  
            <div style={{ fontSize: '0.85rem', color: '#666' }}>{place.types?.join(', ')}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
