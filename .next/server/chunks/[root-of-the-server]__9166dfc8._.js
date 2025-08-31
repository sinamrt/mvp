module.exports = {

"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/pages/api/places.ts [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// pages/api/places.ts
__turbopack_context__.s({
    "default": ()=>handler
});
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
async function handler(req, res) {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
        return res.status(400).json({
            error: 'Query parameter is required'
        });
    }
    const url = `${BASE_URL}?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error_message) {
            return res.status(500).json({
                error: data.error_message
            });
        }
        const results = data.results.map((place)=>({
                name: place.name,
                rating: place.rating,
                place_id: place.place_id,
                types: place.types
            }));
        return res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching places:', error);
        return res.status(500).json({
            error: 'Failed to fetch from Google Places API'
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__9166dfc8._.js.map