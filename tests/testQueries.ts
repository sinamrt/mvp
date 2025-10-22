import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  console.log('users:', await prisma.user.count())
  console.log('dietExclusions:', await prisma.dietExclusion.count())
  // If you have Meal model:
  // console.log('vegan ≤400 kcal:', await prisma.meal.count({ where: { dietType:'VEGAN', kcal:{ lte:400 } } }))
}
main().finally(()=>prisma.$disconnect())
// tests/testQueries.ts