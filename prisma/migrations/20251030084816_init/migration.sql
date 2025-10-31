-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('success', 'failed', 'running');

-- CreateTable
CREATE TABLE "RecResult" (
    "userId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "modelVer" TEXT NOT NULL DEFAULT 'v0.1-rules',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecResult_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "JobRun" (
    "id" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" "JobStatus" NOT NULL,
    "rowsWritten" INTEGER NOT NULL DEFAULT 0,
    "details" JSONB,

    CONSTRAINT "JobRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecResult_updatedAt_modelVer_idx" ON "RecResult"("updatedAt", "modelVer" ASC);

-- CreateIndex
CREATE INDEX "JobRun_jobName_startedAt_idx" ON "JobRun"("jobName", "startedAt" DESC);
