import { prisma } from "@/lib/prisma";

async function run() {
  const job = await prisma.jobRun.create({
    data: { jobName: "recompute_recs", status: "running" },
  });
  let rows = 0;

  try {
    // Fetch candidate users (example: all active)
    const users = await prisma.user.findMany({ select: { id: true } });

    for (const u of users) {
      const feats = await loadUserFeatures(u.id);     // implement from your tables
      const cands = await loadCandidateMeals();       // filter by availability/season, etc.
      const ranked = rankCandidates(cands, feats);    // your v0.1 rules
      await prisma.recResult.upsert({
        where: { userId: u.id },
        update: { items: ranked, modelVer: "v0.1-rules", updatedAt: new Date() },
        create: { userId: u.id, items: ranked, modelVer: "v0.1-rules" },
      });
      rows++;
    }

    await prisma.jobRun.update({
      where: { id: job.id },
      data: { status: "success", finishedAt: new Date(), rowsWritten: rows },
    });
  } catch (e: any) {
    await prisma.jobRun.update({
      where: { id: job.id },
      data: { status: "failed", finishedAt: new Date(), details: { error: String(e?.message || e) } },
    });
    process.exitCode = 1; // fail the job
  } finally {
    await prisma.$disconnect();
  }
}

run();
