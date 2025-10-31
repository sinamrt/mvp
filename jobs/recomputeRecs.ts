import { prisma } from '../lib/prisma';
import { loadUserFeatures, loadCandidateMeals, rankCandidates } from '../lib/ranker';

async function run() {
  const job = await prisma.jobRun.create({ data: { jobName: 'recompute_recs', status: 'running' } });
  let rows = 0;

  try {
    const users = await prisma.user.findMany({ select: { id: true } }); // ✅ delegate: user
    console.log('users:', users.length);

    const cands = await loadCandidateMeals();
    console.log('candidates:', cands.length);

    for (const u of users) {
      const feats = await loadUserFeatures(String(u.id));
      const ranked = rankCandidates(cands, feats);
      if (!ranked.length) continue;

      await prisma.recResult.upsert({
        where: { userId: String(u.id) },
        update: { items: ranked as any, modelVer: 'v0.1-rules', updatedAt: new Date() },
        create: { userId: String(u.id), items: ranked as any, modelVer: 'v0.1-rules' },
      });
      rows++;
    }

    await prisma.jobRun.update({ where: { id: job.id }, data: { status: 'success', finishedAt: new Date(), rowsWritten: rows } });
    console.log(`Job wrote ${rows} rows`);
    process.exit(0);
  } catch (e) {
    await prisma.jobRun.update({ where: { id: job.id }, data: { status: 'failed', finishedAt: new Date(), details: { error: String(e) } } });
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
run();
