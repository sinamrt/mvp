/**
 * lib/penai/emotionClassifier.ts
 *
 * Layer 1 of PEN-AI — Emotion Pattern Classifier
 * Based on Russell's Circumplex Model of Affect (1980)
 *
 * Input:  valence  (-1.0 → +1.0)  negative ←→ positive
 *         arousal  ( 0.0 →  1.0)  calm     ←→ energetic
 *
 * Output: probability distribution across detected emotions
 *
 * No database. No external deps. Pure math.
 */

export type EmotionLabel =
  | 'joy' | 'excitement' | 'elation'
  | 'anger' | 'fear' | 'anxiety'
  | 'sadness' | 'depression' | 'boredom'
  | 'satisfaction' | 'peace' | 'contentment';

export type EmotionProbabilities = Record<EmotionLabel, number>;

export interface EmotionClassification {
  probabilities: EmotionProbabilities;
  dominant:      EmotionLabel;
  valence:       number;
  arousal:       number;
}

// ─── Quadrant mapping (Russell's model) ──────────────────────────────────────
//
//                 HIGH AROUSAL
//                      │
//   anger, fear,       │      joy, excitement,
//   anxiety            │      elation
//                      │
//  ────────────────────┼──────────────────── VALENCE
//  negative            │             positive
//                      │
//   sadness,           │      satisfaction,
//   depression,        │      peace,
//   boredom            │      contentment
//                      │
//                 LOW AROUSAL

export function classifyEmotion(
  valence: number,
  arousal: number
): EmotionClassification {

  // Clamp inputs to valid range
  const v = Math.max(-1, Math.min(1, valence));
  const a = Math.max( 0, Math.min(1, arousal));

  const p: Partial<EmotionProbabilities> = {};

  if (v > 0 && a > 0.5) {
    // Quadrant 1: Positive valence + High arousal
    p.joy        = 0.4 * v * a;
    p.excitement = 0.3 * a;
    p.elation    = 0.3 * v;

  } else if (v < 0 && a > 0.5) {
    // Quadrant 2: Negative valence + High arousal
    p.anger   = 0.4 * Math.abs(v) * a;
    p.fear    = 0.3 * a;
    p.anxiety = 0.3 * Math.abs(v);

  } else if (v < 0 && a <= 0.5) {
    // Quadrant 3: Negative valence + Low arousal
    p.sadness    = 0.5 * Math.abs(v);
    p.depression = 0.3 * (1 - a);
    p.boredom    = 0.2;

  } else {
    // Quadrant 4: Positive valence + Low arousal (calm/content)
    p.satisfaction = 0.4 * Math.max(v, 0.01);
    p.peace        = 0.3 * (1 - a);
    p.contentment  = 0.3;
  }

  // Normalise so all probabilities sum to exactly 1.0
  const total = Object.values(p).reduce((sum, val) => sum + val, 0);
  const normalised = Object.fromEntries(
    Object.entries(p).map(([k, val]) => [k, total > 0 ? val / total : 0])
  ) as EmotionProbabilities;

  // Dominant = highest probability emotion
  const dominant = (
    Object.entries(normalised).reduce((a, b) => a[1] > b[1] ? a : b)[0]
  ) as EmotionLabel;

  return { probabilities: normalised, dominant, valence: v, arousal: a };
}