import { prisma } from './prisma';
interface Candidate { mealId: string }
interface Ranked { meal_id: string; score: number; reasons: string[] }


export async function loadUserFeatures(userId: string) {
  const exclusions = await prisma.foodExclusion.findMany({ where: { userId } });    // ✅ FoodExclusion
  return { userId, exclusions: exclusions.map((e: { foodId?: string; id: string }) => String(e.foodId ?? e.id)) };
}

export async function loadCandidateMeals(limit = 200) {
  const rows = await prisma.mealPreference.findMany({ take: limit });                // ✅ MealPreference
  return rows.map((r: { id: string }) => ({ mealId: String(r.id) })).filter(c => c.mealId);
}

export function rankCandidates(cands: Candidate[], feats: { exclusions?: string[] }): Ranked[] {
  const excl = new Set(feats.exclusions ?? []);
  return cands
    .map((c) => ({ meal_id: c.mealId, score: excl.has(c.mealId) ? 0 : 1, reasons: [] }))
    .filter((r) => r.score > 0);
}
