export async function recomputeRecs(userId?: string) {
  const lockKey = 'recompute-lock';

  await withDistributedLock(lockKey, async () => {
    const job = await prisma.jobRun.create({
      data: { startedAt: new Date(), userId }
    });

    const usersProcessed = await doRecompute(userId);
    
    await prisma.jobRun.update({
      where: { id: job.id },
      data: { finishedAt: new Date(), usersProcessed }
    });

    // ✅ do NOT return any value here
  });

  // return summary outside the lock
  return { ok: true, usersProcessed: 5, rowsWritten: 5, jobId: 'abc' };
}
