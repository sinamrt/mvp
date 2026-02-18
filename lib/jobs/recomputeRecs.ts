import { prisma } from "@/lib/prisma";
import { withDistributedLock } from "@/lib/utils/distributed-lock";

type MealLite = {
  id: number;
  totalProtein: number | null;
  totalCarbs: number | null;
  totalFat: number | null;
};

type JobConfig = {
  targetUserId?: string;
  jobName?: string;
  modelVer?: string;
};

function simpleScore(m: MealLite): number {
  const p = m.totalProtein ?? 0;
  const c = m.totalCarbs ?? 0;
  const f = m.totalFat ?? 0;
  const raw = (p * 1.0 + c * 0.2 - f * 0.3) / 100;
  return Math.max(0, Math.min(1, raw));
}

export async function recomputeRecs(config: JobConfig = {}) {
  const {
    targetUserId,
    jobName = "recompute_recs",
    modelVer = "v0.1-rules"
  } = config;

  const lockKey = targetUserId
    ? `recompute:user:${targetUserId}`
    : `recompute:all_users`;

  return await withDistributedLock(
    lockKey,
    async () => {
      const job = await prisma.jobRun.create({
        data: {
          jobName,
          status: "running",
          startedAt: new Date()
        },
      });

      let rowsWritten = 0;
      let usersProcessed = 0;

      try {
        const users = await prisma.user.findMany({
          where: targetUserId ? { id: targetUserId } : undefined,
          select: { id: true },
        });

        for (const user of users) {
          const exclusions = await prisma.foodExclusion.findMany({
            where: { userId: user.id },
            select: { mealId: true },
          });

          const excludedMealIds = new Set(
            exclusions.map((e) => e.mealId).filter((id): id is number => id !== null)
          );

          const meals: MealLite[] = await prisma.meal.findMany({
            take: 200,
            select: {
              id: true,
              totalProtein: true,
              totalCarbs: true,
              totalFat: true,
            },
          });

          const ranked = meals
            .filter((m) => !excludedMealIds.has(m.id))
            .map((m) => ({ mealId: m.id, score: simpleScore(m) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

          await prisma.recResult.upsert({
            where: { userId: user.id },
            update: {
              items: ranked,
              modelVer,
              updatedAt: new Date(),
            },
            create: {
              userId: user.id,
              items: ranked,
              modelVer,
              updatedAt: new Date(),
            },
          });

          rowsWritten += ranked.length;
          usersProcessed++;
        }

        await prisma.jobRun.update({
          where: { id: job.id },
          data: {
            status: "success",
            finishedAt: new Date(),
            rowsWritten,
            details: {
              usersProcessed,
              modelVer,
              targetUserId: targetUserId || "all_users",
            }
          },
        });

        return { ok: true, usersProcessed, rowsWritten, jobId: job.id };

      } catch (error: unknown) {
        await prisma.jobRun.update({
          where: { id: job.id },
          data: {
            status: "failed",
            finishedAt: new Date(),
            details: {
              error: String((error as Error).message),
              usersProcessed,
              rowsWritten,
            }
          },
        });

        throw error;
      }
    },
    30000,
    300000
  );
}

export default recomputeRecs;