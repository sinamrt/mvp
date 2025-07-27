const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Seed diet exclusions
  const dietExclusions = [
    // Keto exclusions
    { dietType: 'KETO', excludedFood: 'High-carb Grains' },
    { dietType: 'KETO', excludedFood: 'Refined Starches' },
    { dietType: 'KETO', excludedFood: 'Sugar' },
    
    // Mediterranean exclusions
    { dietType: 'MEDITERRANEAN', excludedFood: 'Red Meat' },
    { dietType: 'MEDITERRANEAN', excludedFood: 'Fruit juice' },
    { dietType: 'MEDITERRANEAN', excludedFood: 'Processed Meats' },
    { dietType: 'MEDITERRANEAN', excludedFood: 'Refined Starches' },
    { dietType: 'MEDITERRANEAN', excludedFood: 'Sugar' },
    
    // Paleo exclusions
    { dietType: 'PALEO', excludedFood: 'Dairy' },
    { dietType: 'PALEO', excludedFood: 'Grains' },
    { dietType: 'PALEO', excludedFood: 'Legumes' },
    { dietType: 'PALEO', excludedFood: 'Refined Starches' },
    { dietType: 'PALEO', excludedFood: 'Soy' },
    { dietType: 'PALEO', excludedFood: 'Sugar' },
    
    // Vegan exclusions
    { dietType: 'VEGAN', excludedFood: 'Red Meat' },
    { dietType: 'VEGAN', excludedFood: 'Poultry' },
    { dietType: 'VEGAN', excludedFood: 'Fish' },
    { dietType: 'VEGAN', excludedFood: 'Shellfish' },
    { dietType: 'VEGAN', excludedFood: 'Dairy' },
    { dietType: 'VEGAN', excludedFood: 'Eggs' },
    { dietType: 'VEGAN', excludedFood: 'Mayo' },
    { dietType: 'VEGAN', excludedFood: 'Honey' },
    
    // Vegetarian exclusions
    { dietType: 'VEGETARIAN', excludedFood: 'Red Meat' },
    { dietType: 'VEGETARIAN', excludedFood: 'Poultry' },
    { dietType: 'VEGETARIAN', excludedFood: 'Fish' },
    { dietType: 'VEGETARIAN', excludedFood: 'Shellfish' },
  ]

  console.log('📝 Creating diet exclusions...')
  for (const exclusion of dietExclusions) {
    await prisma.dietExclusion.upsert({
      where: {
        id: `${exclusion.dietType}-${exclusion.excludedFood}`,
      },
      update: {},
      create: {
        id: `${exclusion.dietType}-${exclusion.excludedFood}`,
        ...exclusion,
      },
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
          dietType: 'ANYTHING',
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