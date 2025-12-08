// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
  
prisma.userProgress

async function main() {
  // If you added a UNIQUE on Meal.name, use createMany + skipDuplicates.
  await prisma.meal.createMany({
    data: [
      { name: 'Grilled Chicken Salad', calories: 350, protein: 40, carbs: 12, fat: 10, tags: ['high-protein','gluten-free'] },
      { name: 'Tofu Stir-fry',         calories: 420, protein: 28, carbs: 45, fat: 12, tags: ['vegan'] },
      { name: 'Oats & Berries',        calories: 310, protein: 10, carbs: 55, fat: 6,  tags: ['breakfast'] },
      { name: 'Salmon & Quinoa',       calories: 480, protein: 36, carbs: 34, fat: 18, tags: ['omega-3'] },
      { name: 'Greek Yogurt Bowl',     calories: 260, protein: 22, carbs: 28, fat: 6,  tags: ['snack','breakfast'] },
      { name: 'Veggie Omelette',       calories: 290, protein: 21, carbs: 8,  fat: 18, tags: ['low-carb'] },
      { name: 'Lentil Soup',           calories: 360, protein: 22, carbs: 48, fat: 6,  tags: ['vegetarian'] },
      { name: 'Beef & Brown Rice',     calories: 560, protein: 38, carbs: 58, fat: 16, tags: ['lunch'] },
      { name: 'Chicken Wrap',          calories: 430, protein: 32, carbs: 42, fat: 14, tags: ['lunch'] },
      { name: 'Tuna Salad',            calories: 320, protein: 34, carbs: 6,  fat: 14, tags: ['low-carb'] },
      { name: 'Chickpea Buddha Bowl',  calories: 500, protein: 22, carbs: 70, fat: 14, tags: ['vegan'] },
      { name: 'Turkey Chili',          calories: 520, protein: 40, carbs: 48, fat: 16, tags: ['high-protein'] },
      { name: 'Avocado Toast',         calories: 350, protein: 10, carbs: 38, fat: 18, tags: ['breakfast','vegetarian'] },
      { name: 'Poke Bowl',             calories: 540, protein: 36, carbs: 62, fat: 14, tags: ['fish'] },
      { name: 'Shrimp Pasta',          calories: 580, protein: 32, carbs: 72, fat: 16, tags: ['dinner'] },
      { name: 'Quinoa Salad',          calories: 420, protein: 16, carbs: 58, fat: 12, tags: ['vegetarian'] },
      { name: 'Egg & Spinach Wrap',    calories: 320, protein: 21, carbs: 30, fat: 12, tags: ['breakfast'] },
      { name: 'Cottage Cheese Bowl',   calories: 260, protein: 24, carbs: 16, fat: 8,  tags: ['snack'] },
      { name: 'Tofu Buddha Bowl',      calories: 510, protein: 26, carbs: 68, fat: 16, tags: ['vegan'] },
      { name: 'Chicken & Sweet Potato',calories: 520, protein: 38, carbs: 52, fat: 14, tags: ['dinner'] },
    ],
    skipDuplicates: true, // requires a UNIQUE index (see note below)
  });

  console.log('✅ Seeded meals');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
