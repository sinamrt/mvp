import { prisma } from './prisma';

interface Candidate { mealId: string }
interface Ranked    { meal_id: string; score: number; reasons: string[] }

export async function loadUserFeatures(userId: string) {
  const exclusions = await prisma.foodExclusion.findMany({ where: { userId } });
  return {
    userId,
    exclusions: exclusions.map((e: { mealId?: number | null; id?: number | null }) => String(e.mealId ?? e.id))
  };
}

export async function loadCandidateMeals(limit = 200) {
  const rows = await prisma.mealPreference.findMany({ take: limit });
  return rows
    .map((r: any) => ({ mealId: String(r.id) }))
    .filter((c: { mealId: string }) => c.mealId);
}

export function rankCandidates(
  cands: Candidate[],
  feats: { exclusions?: string[] }
): Ranked[] {
  const excl = new Set(feats.exclusions ?? []);
  return cands
    .map((c) => ({ meal_id: c.mealId, score: excl.has(c.mealId) ? 0 : 1, reasons: [] }))
    .filter((r) => r.score > 0);
}