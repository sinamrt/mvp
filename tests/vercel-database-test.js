import fetch from 'node-fetch';

const VERCEL_URL = 'https://meal4v-cbdlw5m4b-sinamrts-projects.vercel.app';

async function testVercelDatabase() {
  console.log('🗄️ Testing Live Database on Vercel\n');
  
  // Test 1: Check if the application is accessible
  console.log('--- Test 1: Application Accessibility ---');
  try {
    const response = await fetch(VERCEL_URL);
    console.log(`Status: ${response.status}`);
    if (response.status === 401) {
      console.log('⚠️ Application requires authentication (Vercel protection enabled)');
      console.log('💡 You need to disable Vercel Authentication in the dashboard');
    } else if (response.ok) {
      console.log('✅ Application is accessible');
    } else {
      console.log(`❌ Application returned status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Failed to access application:', error.message);
  }

  // Test 2: Test registration endpoint (if accessible)
  console.log('\n--- Test 2: Registration Endpoint Test ---');
  try {
    const testUser = {
      name: 'Vercel Test User',
      email: `vercel-test-${Date.now()}@example.com`,
      password: 'VercelTest123!'
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
    
    if (response.status === 401) {
      console.log('⚠️ Registration blocked by Vercel authentication');
    } else if (response.ok) {
      console.log('✅ Registration endpoint responding');
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Registration endpoint failed');
      const errorText = await response.text();
      console.log('Error:', errorText.substring(0, 200) + '...');
    }
  } catch (error) {
    console.log('❌ Registration test failed:', error.message);
  }

  // Test 3: Test API endpoints
  console.log('\n--- Test 3: API Endpoints Test ---');
  
  const endpoints = [
    '/api/auth/[...nextauth]',
    '/api/places'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${VERCEL_URL}${endpoint}`);
      console.log(`${endpoint} - Status: ${response.status}`);
      
      if (response.status === 401) {
        console.log(`  ⚠️ ${endpoint} requires authentication`);
      } else if (response.ok) {
        console.log(`  ✅ ${endpoint} is accessible`);
      } else {
        console.log(`  ❌ ${endpoint} returned ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ ${endpoint} failed: ${error.message}`);
    }
  }

  // Test 4: Check environment variables (indirectly)
  console.log('\n--- Test 4: Environment Variables Check ---');
  try {
    // Try to access a page that would use database
    const response = await fetch(`${VERCEL_URL}/register`);
    console.log(`Register page - Status: ${response.status}`);
    
    if (response.status === 401) {
      console.log('⚠️ Page access blocked by Vercel authentication');
      console.log('💡 This prevents testing database functionality');
    } else if (response.ok) {
      console.log('✅ Register page accessible');
      console.log('💡 Database environment variables appear to be configured');
    } else {
      console.log(`❌ Register page returned ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Environment check failed:', error.message);
  }

  console.log('\n--- Summary ---');
  console.log('🔍 To properly test the database:');
  console.log('1. Go to Vercel Dashboard → Your Project → Settings → Security');
  console.log('2. Disable "Vercel Authentication" or set to "Public"');
  console.log('3. Redeploy the application');
  console.log('4. Run this test again');
}

// Run the test
testVercelDatabase().catch(console.error); 