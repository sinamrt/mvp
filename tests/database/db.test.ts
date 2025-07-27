import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Database Initialization Tests', () => {
  beforeAll(async () => {
    // Ensure database connection
    await prisma.$connect()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  test('TC-DB-001: Database connection successful', async () => {
    const result = await prisma.$queryRaw`SELECT 1 as test`
    expect(result).toEqual([{ test: 1 }])
  })

  test('TC-DB-002: All required tables exist', async () => {
    const tables = [
      'users',
      'diet_preferences', 
      'food_exclusions',
      'diet_exclusions',
      'nutrition_goals',
      'macro_ranges',
      'meal_preferences',
      'nutrition_limits',
      'user_progress',
      'diet_forms'
    ]

    for (const table of tables) {
      const result = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = ${table}
        ) as exists
      `
      expect(result[0].exists).toBe(true)
    }
  })

  test('TC-DB-003: Admin user exists', async () => {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@dietapp.com' }
    })
    
    expect(adminUser).toBeDefined()
    expect(adminUser?.role).toBe('ADMIN')
  })

  test('TC-DB-004: Diet exclusions seeded', async () => {
    const exclusions = await prisma.dietExclusion.findMany()
    expect(exclusions.length).toBeGreaterThan(0)
  })

  test('TC-DB-005: Foreign key relationships work', async () => {
    const user = await prisma.user.findFirst({
      include: {
        dietPreferences: true,
        nutritionGoals: true,
        macroRanges: true
      }
    })
    
    expect(user).toBeDefined()
    expect(user?.dietPreferences).toBeDefined()
    expect(user?.nutritionGoals).toBeDefined()
    expect(user?.macroRanges).toBeDefined()
  })
}) 