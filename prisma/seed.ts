import { PrismaClient, DietType, AllergenType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Seed diet exclusions
  const dietExclusions = [
    // Keto exclusions
    { dietType: DietType.KETO, excludedFood: 'High-carb Grains' },
    { dietType: DietType.KETO, excludedFood: 'Refined Starches' },
    { dietType: DietType.KETO, excludedFood: 'Sugar' },
    
    // Mediterranean exclusions
    { dietType: DietType.MEDITERRANEAN, excludedFood: 'Red Meat' },
    { dietType: DietType.MEDITERRANEAN, excludedFood: 'Fruit juice' },
    { dietType: DietType.MEDITERRANEAN, excludedFood: 'Processed Meats' },
    { dietType: DietType.MEDITERRANEAN, excludedFood: 'Refined Starches' },
    { dietType: DietType.MEDITERRANEAN, excludedFood: 'Sugar' },
    
    // Paleo exclusions
    { dietType: DietType.PALEO, excludedFood: 'Dairy' },
    { dietType: DietType.PALEO, excludedFood: 'Grains' },
    { dietType: DietType.PALEO, excludedFood: 'Legumes' },
    { dietType: DietType.PALEO, excludedFood: 'Refined Starches' },
    { dietType: DietType.PALEO, excludedFood: 'Soy' },
    { dietType: DietType.PALEO, excludedFood: 'Sugar' },
    
    // Vegan exclusions
    { dietType: DietType.VEGAN, excludedFood: 'Red Meat' },
    { dietType: DietType.VEGAN, excludedFood: 'Poultry' },
    { dietType: DietType.VEGAN, excludedFood: 'Fish' },
    { dietType: DietType.VEGAN, excludedFood: 'Shellfish' },
    { dietType: DietType.VEGAN, excludedFood: 'Dairy' },
    { dietType: DietType.VEGAN, excludedFood: 'Eggs' },
    { dietType: DietType.VEGAN, excludedFood: 'Mayo' },
    { dietType: DietType.VEGAN, excludedFood: 'Honey' },
    
    // Vegetarian exclusions
    { dietType: DietType.VEGETARIAN, excludedFood: 'Red Meat' },
    { dietType: DietType.VEGETARIAN, excludedFood: 'Poultry' },
    { dietType: DietType.VEGETARIAN, excludedFood: 'Fish' },
    { dietType: DietType.VEGETARIAN, excludedFood: 'Shellfish' },
  ]

  console.log('📝 Creating diet exclusions...')
  for (const exclusion of dietExclusions) {
    await prisma.dietExclusion.upsert({
      where: {
        dietType_excludedFood: {
          dietType: exclusion.dietType,
          excludedFood: exclusion.excludedFood,
        },
      },
      update: {},
      create: exclusion,
    })
  }

  // Create a default admin user
  console.log('👤 Creating default admin user...')
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dietapp.com' },
    update: {},
    create: {
      email: 'admin@dietapp.com',
      name: 'Admin User',
      role: 'ADMIN',
      dietPreferences: {
        create: {
          dietType: DietType.ANYTHING,
          measurementUnit: 'US_STANDARD',
          energyUnit: 'CALORIES',
        },
      },
      nutritionGoals: {
        create: {
          goalType: 'MAINTAIN',
          goalMode: 'GENERAL',
        },
      },
      macroRanges: {
        create: {
          carbsMin: 48,
          carbsMax: 272,
          fatsMin: 90,
          fatsMax: 121,
          proteinMin: 80,
          proteinMax: 272,
        },
      },
      mealPreferences: {
        create: {
          breakfast: true,
          lunch: true,
          dinner: true,
          snack: true,
          favoriteDishes: ['Salad', 'Grilled Chicken', 'Quinoa'],
        },
      },
      nutritionLimits: {
        create: {
          minFiber: 25,
          limitSodium: false,
          limitCholesterol: false,
        },
      },
    },
  })

  console.log('✅ Database seeding completed!')
  console.log(`Admin user created: ${adminUser.email}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 