import { useState } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useSession, signIn, signOut } from "next-auth/react";

type Place = {
  name: string;
  rating?: number;
  types?: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: -33.8688, lng: 151.2093 }); // Sydney default

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setError("");
    setPlaces([]);

    try {
      const res = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch places");

      setPlaces(data.results || []);

      // Update map center to first place if exists
      if (data.results?.[0]?.geometry?.location) {
        setMapCenter(data.results[0].geometry.location);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🔍 Find Places</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., cafes in Melbourne"
        style={{ padding: "0.5rem", width: "300px" }}
      />
      <button onClick={handleSearch} style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "2rem" }}>
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={13}>
            {places.map((place, i) => (
              <Marker
                key={i}
                position={{
                  lat: place.geometry.location.lat,
                  lng: place.geometry.location.lng,
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      <ul style={{ marginTop: "2rem" }}>
        {places.map((place, i) => (
          <li key={i} style={{ marginBottom: "1rem" }}>
            <strong>{place.name}</strong> — ⭐ {place.rating}
            <div>{place.types?.slice(0, 3).join(", ")}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
