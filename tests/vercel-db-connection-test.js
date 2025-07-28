import fetch from 'node-fetch';

const VERCEL_URL = 'https://meal4v-cbdlw5m4b-sinamrts-projects.vercel.app';

async function testDatabaseConnection() {
  console.log('🗄️ Testing Database Connection on Vercel\n');
  
  // Test 1: Check if application is now accessible
  console.log('--- Test 1: Application Access ---');
  try {
    const response = await fetch(VERCEL_URL);
    console.log(`Status: ${response.status}`);
    
    if (response.status === 401) {
      console.log('❌ Still blocked by Vercel authentication');
      console.log('💡 Please disable Vercel Authentication in dashboard first');
      return;
    } else if (response.ok) {
      console.log('✅ Application is accessible');
    } else {
      console.log(`⚠️ Application returned status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Failed to access application:', error.message);
    return;
  }

  // Test 2: Test user registration (database write)
  console.log('\n--- Test 2: Database Write Test (Registration) ---');
  try {
    const testUser = {
      name: 'Database Test User',
      email: `db-test-${Date.now()}@example.com`,
      password: 'DatabaseTest123!'
    };

    const response = await fetch(`${VERCEL_URL}/api/auth/signin/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        callbackUrl: `${VERCEL_URL}/diet-form`,
        json: 'true'
      })
    });

    console.log(`Registration test - Status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Registration successful - Database write working');
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
    } else if (response.status === 500) {
      console.log('❌ Registration failed - Database connection issue');
      const errorText = await response.text();
      console.log('Error:', errorText.substring(0, 300) + '...');
    } else {
      console.log(`⚠️ Registration returned status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Registration test failed:', error.message);
  }

  // Test 3: Test login with existing user (database read)
  console.log('\n--- Test 3: Database Read Test (Login) ---');
  try {
    const response = await fetch(`${VERCEL_URL}/api/auth/signin/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: 'admin@dietapp.com',
        password: 'admin123',
        callbackUrl: `${VERCEL_URL}/diet-form`,
        json: 'true'
      })
    });

    console.log(`Login test - Status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Login successful - Database read working');
    } else if (response.status === 500) {
      console.log('❌ Login failed - Database connection issue');
    } else {
      console.log(`⚠️ Login returned status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Login test failed:', error.message);
  }

  // Test 4: Test API endpoints that use database
  console.log('\n--- Test 4: API Endpoints Database Test ---');
  
  const endpoints = [
    '/api/auth/[...nextauth]',
    '/api/places'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${VERCEL_URL}${endpoint}`);
      console.log(`${endpoint} - Status: ${response.status}`);
      
      if (response.ok) {
        console.log(`  ✅ ${endpoint} working`);
      } else if (response.status === 500) {
        console.log(`  ❌ ${endpoint} database error`);
      } else {
        console.log(`  ⚠️ ${endpoint} status: ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ ${endpoint} failed: ${error.message}`);
    }
  }

  console.log('\n--- Database Test Summary ---');
  console.log('✅ If all tests pass: Database is working correctly');
  console.log('❌ If 500 errors: Database connection issues');
  console.log('⚠️ If 401 errors: Still need to disable Vercel authentication');
}

// Run the test
testDatabaseConnection().catch(console.error); 