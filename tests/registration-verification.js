import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyRegistration() {
  console.log('🔍 Verifying User Registration in Database\n');
  
  try {
    // Test 1: Check if test users exist in database
    console.log('--- Test 1: Database User Verification ---');
    
    const testEmails = [
      'testuser1@example.com',
      'testuser2@example.com',
      'dbtest@example.com'
    ];
    
    for (const email of testEmails) {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (user) {
        console.log(`✅ User found: ${email}`);
        console.log(`   - Name: ${user.name}`);
        console.log(`   - Role: ${user.role}`);
        console.log(`   - Created: ${user.createdAt}`);
        console.log(`   - Has password hash: ${user.passwordHash ? 'Yes' : 'No'}`);
      } else {
        console.log(`❌ User not found: ${email}`);
      }
    }
    
    // Test 2: Check total user count
    console.log('\n--- Test 2: Database Statistics ---');
    const totalUsers = await prisma.user.count();
    console.log(`Total users in database: ${totalUsers}`);
    
    // Test 3: Check admin user exists
    console.log('\n--- Test 3: Admin User Check ---');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@dietapp.com' }
    });
    
    if (adminUser) {
      console.log('✅ Admin user exists');
      console.log(`   - Role: ${adminUser.role}`);
    } else {
      console.log('❌ Admin user not found');
    }
    
    // Test 4: Check user roles distribution
    console.log('\n--- Test 4: User Roles Distribution ---');
    const userRoles = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });
    
    userRoles.forEach(role => {
      console.log(`   - ${role.role}: ${role._count.role} users`);
    });
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the verification
verifyRegistration().catch(console.error); 