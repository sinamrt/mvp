import React from 'react';
// components/PlaceCard.tsx
type Props = {
    name: string;
    rating?: number;
    types?: string[];
  };
  
  export default function PlaceCard({ name, rating, types }: Props) {
    return (
      <div style={{
        padding: '1rem',
        marginBottom: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f8f8f8'
      }}>
        <h3>{name}</h3>
        {rating && <p>⭐ {rating}</p>}
        {types && <small>{types.join(', ')}</small>}
      </div>
    );
  }
  