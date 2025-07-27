-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY');

-- CreateEnum
CREATE TYPE "BodyFat" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('DESK_JOB', 'LIGHTLY_ACTIVE', 'ACTIVE', 'VERY_ATHLETIC', 'EXTREMELY_ATHLETIC');

-- CreateEnum
CREATE TYPE "DietType" AS ENUM ('ANYTHING', 'KETO', 'MEDITERRANEAN', 'PALEO', 'VEGAN', 'VEGETARIAN', 'OMNIVORE', 'FOUR_FED');

-- CreateEnum
CREATE TYPE "MeasurementUnit" AS ENUM ('US_STANDARD', 'METRIC');

-- CreateEnum
CREATE TYPE "EnergyUnit" AS ENUM ('CALORIES', 'KILOJOULES');

-- CreateEnum
CREATE TYPE "AllergenType" AS ENUM ('DAIRY', 'EGGS', 'FISH', 'GLUTEN', 'TREE_NUTS', 'PEANUTS', 'SESAME', 'SHELLFISH', 'SOY');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('LOSE_FAT', 'MAINTAIN', 'BUILD_MUSCLE');

-- CreateEnum
CREATE TYPE "GoalMode" AS ENUM ('GENERAL', 'EXACT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sex" "Sex",
    "heightCm" INTEGER,
    "weightKg" DOUBLE PRECISION,
    "age" INTEGER,
    "bodyFat" "BodyFat",
    "activityLevel" "ActivityLevel",

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diet_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dietType" "DietType" NOT NULL,
    "measurementUnit" "MeasurementUnit" NOT NULL DEFAULT 'US_STANDARD',
    "energyUnit" "EnergyUnit" NOT NULL DEFAULT 'CALORIES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diet_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_exclusions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "allergenType" "AllergenType" NOT NULL,
    "customFood" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_exclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diet_exclusions" (
    "id" TEXT NOT NULL,
    "dietType" "DietType" NOT NULL,
    "excludedFood" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diet_exclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalType" "GoalType" NOT NULL,
    "goalMode" "GoalMode" NOT NULL DEFAULT 'GENERAL',
    "targetWeight" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nutrition_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "macro_ranges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carbsMin" INTEGER NOT NULL,
    "carbsMax" INTEGER NOT NULL,
    "fatsMin" INTEGER NOT NULL,
    "fatsMax" INTEGER NOT NULL,
    "proteinMin" INTEGER NOT NULL,
    "proteinMax" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "macro_ranges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "breakfast" BOOLEAN NOT NULL DEFAULT true,
    "lunch" BOOLEAN NOT NULL DEFAULT true,
    "dinner" BOOLEAN NOT NULL DEFAULT true,
    "snack" BOOLEAN NOT NULL DEFAULT true,
    "favoriteDishes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meal_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_limits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "minFiber" INTEGER NOT NULL DEFAULT 25,
    "limitSodium" BOOLEAN NOT NULL DEFAULT false,
    "limitCholesterol" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nutrition_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weightKg" DOUBLE PRECISION,
    "bodyFat" "BodyFat",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diet_forms" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dietType" "DietType" NOT NULL,
    "answers" TEXT[],
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diet_forms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "diet_preferences_userId_key" ON "diet_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_goals_userId_key" ON "nutrition_goals"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "macro_ranges_userId_key" ON "macro_ranges"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "meal_preferences_userId_key" ON "meal_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_limits_userId_key" ON "nutrition_limits"("userId");

-- AddForeignKey
ALTER TABLE "diet_preferences" ADD CONSTRAINT "diet_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_exclusions" ADD CONSTRAINT "food_exclusions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_goals" ADD CONSTRAINT "nutrition_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "macro_ranges" ADD CONSTRAINT "macro_ranges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_preferences" ADD CONSTRAINT "meal_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_limits" ADD CONSTRAINT "nutrition_limits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diet_forms" ADD CONSTRAINT "diet_forms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
