/**
 * lib/penai/recommendEngine.ts
 *
 * Layer 3 of PEN-AI — Recommendation Engine
 *
 * Uses cosine similarity to rank foods against the user's
 * current nutritional needs vector derived from their emotional state.
 *
 * Replaces the stub rankCandidates() in lib/ranker.ts with real scoring.
 * DB integration: when Prisma food table is ready, swap FOOD_DATABASE
 * for a DB query — the algorithm itself does not change.
 *
 * No database. No external deps. Pure math.
 */

import { classifyEmotion, EmotionClassification } from './emotionClassifier';
import { emotionToNutritionNeeds, NeurochemicalState, NutritionNeeds } from './neurochemicalEngine';
 

// ─── Food database ────────────────────────────────────────────────────────────
// Each food is scored 0–1 across 6 nutritional dimensions.
// These dimensions match exactly the NutritionNeeds output — enabling
// direct cosine similarity comparison.
//
// When Prisma food table exists, replace this with:
//   const foods = await prisma.food.findMany()
// The algorithm below does not change.

export interface FoodEntry {
  name:     string;
  emoji:    string;
  calories: number;
  image:    string;
  // Nutritional profile (0–1 scale, matching NutritionNeeds dimensions)
  sugar:    number;
  protein:  number;
  fat:      number;
  salt:     number;
  spicy:    number;
  energy:   number;
}

export const FOOD_DATABASE: Record<string, FoodEntry> = {
  pizza:     { name:'Pizza',     emoji:'🍕', calories:520, sugar:0.20, protein:0.30, fat:0.80, spicy:0.10, salt:0.70, energy:0.60, image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
  salad:     { name:'Salad',     emoji:'🥗', calories:180, sugar:0.10, protein:0.70, fat:0.20, spicy:0.00, salt:0.20, energy:0.30, image:'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=400&h=300&fit=crop' },
  chocolate: { name:'Chocolate', emoji:'🍫', calories:250, sugar:0.90, protein:0.10, fat:0.40, spicy:0.00, salt:0.10, energy:0.70, image:'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop' },
  steak:     { name:'Steak',     emoji:'🥩', calories:680, sugar:0.00, protein:0.90, fat:0.60, spicy:0.20, salt:0.40, energy:0.80, image:'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
  burger:    { name:'Burger',    emoji:'🍔', calories:590, sugar:0.30, protein:0.40, fat:0.90, spicy:0.20, salt:0.80, energy:0.70, image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  sushi:     { name:'Sushi',     emoji:'🍱', calories:320, sugar:0.10, protein:0.80, fat:0.30, spicy:0.40, salt:0.60, energy:0.50, image:'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop' },
  ice_cream: { name:'Ice Cream', emoji:'🍦', calories:280, sugar:0.95, protein:0.20, fat:0.50, spicy:0.00, salt:0.10, energy:0.60, image:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
  soup:      { name:'Soup',      emoji:'🍜', calories:210, sugar:0.10, protein:0.40, fat:0.30, spicy:0.30, salt:0.70, energy:0.40, image:'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&h=300&fit=crop' },
  fruit:     { name:'Fruit',     emoji:'🍎', calories:120, sugar:0.70, protein:0.10, fat:0.05, spicy:0.00, salt:0.00, energy:0.50, image:'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop' },
  nuts:      { name:'Nuts',      emoji:'🥜', calories:420, sugar:0.10, protein:0.70, fat:0.80, spicy:0.00, salt:0.30, energy:0.90, image:'https://images.unsplash.com/photo-1536591375667-f3c4f36c7f5b?w=400&h=300&fit=crop' },
  pasta:     { name:'Pasta',     emoji:'🍝', calories:380, sugar:0.20, protein:0.40, fat:0.30, spicy:0.10, salt:0.50, energy:0.70, image:'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop' },
  yogurt:    { name:'Yogurt',    emoji:'🥛', calories:150, sugar:0.30, protein:0.60, fat:0.20, spicy:0.00, salt:0.10, energy:0.40, image:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop' },
  avocado:   { name:'Avocado',   emoji:'🥑', calories:240, sugar:0.10, protein:0.20, fat:0.90, spicy:0.00, salt:0.10, energy:0.60, image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
  chicken:   { name:'Chicken',   emoji:'🍗', calories:330, sugar:0.00, protein:0.90, fat:0.40, spicy:0.10, salt:0.30, energy:0.70, image:'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=400&h=300&fit=crop' },
  smoothie:  { name:'Smoothie',  emoji:'🥤', calories:190, sugar:0.60, protein:0.30, fat:0.20, spicy:0.00, salt:0.10, energy:0.60, image:'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=300&fit=crop' },
};

// Ordered dimension keys — must match NutritionNeeds fields
const DIMS: (keyof NutritionNeeds)[] = [
  'sugar', 'protein', 'fat', 'salt', 'spicy', 'energy'
];

// ─── Cosine similarity ────────────────────────────────────────────────────────
function cosineSimilarity(a: number[], b: number[]): number {
  const dot  = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return magA > 0 && magB > 0 ? dot / (magA * magB) : 0;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RecommendedMeal {
  key:        string;      // database key e.g. 'chicken'
  name:       string;
  emoji:      string;
  calories:   number;
  image:      string;
  score:      number;      // raw cosine similarity (0–1)
  matchPct:   number;      // score × 100, rounded to 1dp
  reason:     string;      // human-readable explanation
}

export interface PENAIResult {
  emotion:          EmotionClassification;
  neuroState:       NeurochemicalState;
  nutritionNeeds:   NutritionNeeds;
  recommendations:  RecommendedMeal[];
}

// ─── Reason map ───────────────────────────────────────────────────────────────
const REASON_MAP: Record<string, string> = {
  joy:          'sustains your positive energy',
  excitement:   'fuels your high energy state',
  elation:      'complements your uplifted mood',
  anger:        'cools inflammation and calms the body',
  fear:         'grounds and stabilises your nervous system',
  anxiety:      'rich in calming nutrients for stress relief',
  sadness:      'boosts serotonin and provides comfort',
  depression:   'supports dopamine and mood recovery',
  boredom:      'adds stimulation and sensory variety',
  satisfaction: 'maintains your balanced state',
  peace:        'light and harmonious for a calm mind',
  contentment:  'nourishing without overwhelming',
};

// ─── Main export ──────────────────────────────────────────────────────────────
export function runPENAI(
  valence: number,
  arousal: number,
  stress:  number = 0.5,
  topN:    number = 5,
): PENAIResult {

  // Layer 1 — classify emotion
  const emotion = classifyEmotion(valence, arousal);

  // Layer 2 — neurochemical state → nutrition needs
  const { neuroState, nutritionNeeds } = emotionToNutritionNeeds(
    valence, arousal, stress
  );

  // Layer 3 — cosine similarity against all foods
  const needsVec = DIMS.map(d => nutritionNeeds[d]);
  const reason   = REASON_MAP[emotion.dominant] ?? 'matches your current state';

  const scored = Object.entries(FOOD_DATABASE).map(([key, food]) => {
    const foodVec  = DIMS.map(d => food[d as keyof FoodEntry] as number);
    const score    = cosineSimilarity(needsVec, foodVec);
    return {
      key,
      name:     food.name,
      emoji:    food.emoji,
      calories: food.calories,
      image:    food.image,
      score:    parseFloat(score.toFixed(4)),
      matchPct: parseFloat((score * 100).toFixed(1)),
      reason,
    } satisfies RecommendedMeal;
  });

  const recommendations = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return { emotion, neuroState, nutritionNeeds, recommendations };
}
