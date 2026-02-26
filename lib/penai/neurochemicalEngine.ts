/**
 * lib/penai/neurochemicalEngine.ts
 *
 * Layer 2 of PEN-AI — Neurochemical Engine
 *
 * Maps emotional state (valence, arousal, stress) →
 *   neurotransmitter levels (dopamine, serotonin, cortisol, adrenaline) →
 *   nutritional needs (sugar, protein, fat, salt, spicy, energy)
 *
 * Science basis:
 *   Dopamine   — reward, motivation. Low → craves sugar/quick energy
 *   Serotonin  — mood stability.     Low → needs tryptophan (protein)
 *   Cortisol   — stress hormone.     High → craves fat/comfort food
 *   Adrenaline — arousal/fight-or-flight. High → craves spicy/energising food
 *
 * No database. No external deps. Pure math.
 */

export interface NeurochemicalState {
  dopamine:   number;   // reward pathway
  serotonin:  number;   // mood regulation
  cortisol:   number;   // stress response
  adrenaline: number;   // arousal / fight-or-flight
}

export interface NutritionNeeds {
  sugar:   number;   // 0–1 craving for simple carbs / quick energy
  protein: number;   // 0–1 need for tryptophan-rich protein
  fat:     number;   // 0–1 comfort fat craving
  salt:    number;   // 0–1 electrolyte / mineral need
  spicy:   number;   // 0–1 stimulation craving
  energy:  number;   // 0–1 overall energy density need
}

// ─── Neurotransmitter weights (empirically tuned) ─────────────────────────────
const WEIGHTS = {
  dopamine: {
    valence:  0.6,   // positive mood boosts dopamine
    arousal:  0.4,   // high arousal raises dopamine
    stress:  -0.5,   // stress depletes dopamine
  },
  serotonin: {
    valence:  0.7,   // positive mood strongly correlates with serotonin
    arousal: -0.3,   // high arousal slightly lowers serotonin
  },
  cortisol: {
    stress:   0.8,   // stress is the primary cortisol driver
    arousal:  0.5,   // high arousal raises cortisol
    valence: -0.4,   // positive mood suppresses cortisol
  },
  adrenaline: {
    arousal:  1.0,   // adrenaline directly tracks arousal
  },
} as const;

export function calculateNeurotransmitters(
  valence: number,
  arousal: number,
  stress:  number = 0.5
): NeurochemicalState {
  return {
    dopamine:
      WEIGHTS.dopamine.valence * valence +
      WEIGHTS.dopamine.arousal * arousal +
      WEIGHTS.dopamine.stress  * stress,

    serotonin:
      WEIGHTS.serotonin.valence * valence +
      WEIGHTS.serotonin.arousal * arousal,

    cortisol:
      WEIGHTS.cortisol.stress   * stress  +
      WEIGHTS.cortisol.arousal  * arousal +
      WEIGHTS.cortisol.valence  * valence,

    adrenaline:
      WEIGHTS.adrenaline.arousal * arousal,
  };
}

export function neuroToNutritionNeeds(n: NeurochemicalState): NutritionNeeds {
  // Deficits in neurotransmitters → cravings
  // Math.max(0, ...) ensures needs are never negative
  return {
    sugar:   Math.max(0, -n.dopamine),          // low dopamine → sugar craving
    protein: Math.max(0, -n.serotonin),          // low serotonin → protein need
    fat:     Math.max(0,  n.cortisol),           // high cortisol → comfort fat
    salt:    Math.max(0,  0.5 * n.cortisol),     // cortisol raises salt craving
    spicy:   Math.max(0,  n.adrenaline),         // high adrenaline → spicy craving
    energy:  Math.max(0,  n.adrenaline),         // high adrenaline → energy density need
  };
}

/**
 * Convenience: run both steps in one call
 */
export function emotionToNutritionNeeds(
  valence: number,
  arousal: number,
  stress:  number = 0.5
): { neuroState: NeurochemicalState; nutritionNeeds: NutritionNeeds } {
  const neuroState     = calculateNeurotransmitters(valence, arousal, stress);
  const nutritionNeeds = neuroToNutritionNeeds(neuroState);
  return { neuroState, nutritionNeeds };
}
