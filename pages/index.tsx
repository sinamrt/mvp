'use client';

import { useSession } from "next-auth/react";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";

interface Place {
  name: string;
  rating: number;
  place_id: string;
  types: string[];
}

export default function Home() {
  const sessionData = useSession();
  const data = sessionData?.data;
  const status = sessionData?.status;
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
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to fetch places');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <p>Loading session...</p>;
  }

  if (!data) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Welcome to Google Places MVP</h1>
        <p>Please sign in to use the search functionality.</p>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔍 Google Places Search</h1>
      <p>Welcome, {data.user?.name} <button onClick={() => signOut()}>Sign out</button></p>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search e.g. cafes in Sydney"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', marginRight: '0.5rem' }}
        />
        <button onClick={handleSearch} style={{ padding: '0.5rem 1rem' }}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <ul>
          {results.map((place) => (
            <li key={place.place_id} style={{ marginBottom: '1rem' }}>
              <strong>{place.name}</strong><br />
               {place.rating || 'N/A'}<br />
               {place.types.join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
