import React from 'react';

type Props = {
  name: string;
  rating?: number;
  types?: string[];
};

export default function PlaceCard({ name, rating, types }: Props) {
  return (
    <div>
      <h3>{name}</h3>
      {rating && <p>Rating: {rating}</p>}
      {types && <small>{types.join(', ')}</small>}
    </div>
  );
}
