// pages/api/places.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

type Place = {
  name: string;
  rating: number;
  place_id: string;
  types: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const url = `${BASE_URL}?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error_message) {
      return res.status(500).json({ error: data.error_message });
    }

    const results = data.results.map((place: Place) => ({
      name: place.name,
      rating: place.rating,
      place_id: place.place_id,
      types: place.types,
    }));

    return res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching places:', error);
    return res.status(500).json({ error: 'Failed to fetch from Google Places API' });
  }
}
