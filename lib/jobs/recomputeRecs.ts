import { prisma } from "@/lib/prisma";
import { withDistributedLock } from "@/lib/utils/distributed-lock";

// Types
type MealLite = {
  id: string;
  name: string | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

type RecommendationItem = {
  mealId: string;
  score: number;
};

type JobConfig = {
  targetUserId?: string;
  jobName?: string;
  modelVer?: string;
};

/**
 * simpleScore()
 * Deterministic, safe scoring function.
 * Prioritizes protein, lightly weights carbs, penalizes fat.
 */
function simpleScore(m: MealLite): number {
  const p = m.protein ?? 0;
  const c = m.carbs ?? 0;
  const f = m.fat ?? 0;
  const raw = (p * 1.0 + c * 0.2 - f * 0.3) / 100;
  return Math.max(0, Math.min(1, raw));
}

/**
 * recomputeRecs()
 * Enhanced recommendation service with job tracking, flexible targeting, and distributed locking
 */
export async function recomputeRecs(config: JobConfig = {}) {
  const {
    targetUserId,
    jobName = "recompute_recs",
    modelVer = "v0.1-rules"
  } = config;

  // Create unique lock key based on job scope to prevent concurrent execution
  const lockKey = targetUserId 
    ? `recompute:user:${targetUserId}`
    : `recompute:all_users`;

  // Wrap entire job execution with distributed lock
  return await withDistributedLock(
    lockKey,
    async () => {
      // 0️⃣ Create job run record for monitoring
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
        // 1️⃣ Select target users
        const users = await prisma.user.findMany({
          where: targetUserId ? { id: targetUserId } : undefined,
          select: { id: true },
        });

        console.log(`🔒 Lock acquired. Processing ${users.length} users...`);

        for (const user of users) {
          // 2️⃣ Load user preferences and exclusions
          const prefs = await prisma.dietPreference.findMany({
            where: { userId: user.id },
            select: { id: true, dietType: true, measurementUnit: true, energyUnit: true },
          });

          const exclusions = await prisma.foodExclusion.findMany({
            where: { userId: user.id },
            select: { mealId: true },
          });

          const excludedMealIds = new Set(
            exclusions.map((e) => e.mealId).filter(Boolean) as string[]
          );

          // 3️⃣ Fetch canonical meal candidates (safe, minimal select)
          const meals: MealLite[] = await prisma.meal.findMany({
            take: 200,
            select: {
              id: true,
              name: true,
              protein: true,
              carbs: true,
              fat: true,
            },
          });

          // 4️⃣ Scoring + exclusion filter
          const ranked: RecommendationItem[] = meals
            .filter((m) => !excludedMealIds.has(m.id))
            .map((m) => {
              const score = simpleScore(m);
              return { mealId: m.id, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

          // 5️⃣ Safe transactional write with relational integrity
          await prisma.$transaction(async (tx) => {
            // Delete existing recommendations
            await tx.userRecommendations.deleteMany({
              where: { userId: user.id },
            });

            // Insert new recommendations if any
            if (ranked.length > 0) {
              await tx.userRecommendations.createMany({
                data: ranked.map((r) => ({
                  userId: user.id,
                  mealId: r.mealId,
                  score: r.score,
                  modelVer,
                  updatedAt: new Date(),
                })),
                skipDuplicates: true,
              });
              rowsWritten += ranked.length;
            }
          });

          usersProcessed++;

          // Progress update every 10 users
          if (usersProcessed % 10 === 0) {
            console.log(`📊 Progress: ${usersProcessed}/${users.length} users processed`);
          }
        }

        // 6️⃣ Update job run with success
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
              lockKey // Store lock key for debugging
            }
          },
        });

        console.log(`✅ Job ${job.id} completed: ${usersProcessed} users, ${rowsWritten} recommendations`);

        return { 
          ok: true, 
          usersProcessed, 
          rowsWritten,
          jobId: job.id 
        };

      } catch (error: unknown) {
        console.error(`❌ Job ${job?.id} failed:`, error);
        
        // 7️⃣ Update job run with failure details
        if (job) {
          await prisma.jobRun.update({
            where: { id: job.id },
            data: { 
              status: "failed", 
              finishedAt: new Date(), 
              details: { 
                error: String((error as Error).message),
                stack: (error as Error).stack,
                usersProcessed,
                rowsWritten,
                lockKey
              } 
            },
          });
        }

        // Re-throw for caller handling
        throw error;
      }
    },
    30000, // 30 second lock acquisition timeout
    300000 // 5 minute lock TTL (adjust based on expected job duration)
  );
}

/**
 * Standalone batch job execution with lock awareness
 */
async function runAsJob() {
  try {
    console.log('🚀 Starting recommendation recomputation job with distributed locking...');
    
    const result = await recomputeRecs({
      jobName: "recompute_recs_batch",
      modelVer: "v0.1-rules"
    });
    
    console.log(`🎉 Job completed successfully!`);
    console.log(`   Users processed: ${result.usersProcessed}`);
    console.log(`   Rows written: ${result.rowsWritten}`);
    console.log(`   Job ID: ${result.jobId}`);
    
  } catch (error: any) {
    if (error.message.includes('Could not acquire lock')) {
      console.log('⏸️  Job skipped: Another instance is already running');
    } else {
      console.error("💥 Job failed:", error);
    }
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI execution support
if (require.main === module) {
  runAsJob();
}

export default recomputeRecs;