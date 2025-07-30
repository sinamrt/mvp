import fetch from 'node-fetch';

// Test data for registration
const testUsers = [
  {
    name: 'Test User 1',
    email: 'testuser1@example.com',
    password: 'SecurePassword123!'
  },
  {
    name: 'Test User 2', 
    email: 'testuser2@example.com',
    password: 'MyPass123!@#'
  }
];

async function testRegistration() {
  console.log('🧪 Testing User Registration Functionality\n');
  
  // Test 1: Check if registration page is accessible
  console.log('--- Test 1: Registration Page Accessibility ---');
  try {
    const response = await fetch('http://localhost:3000/register');
    console.log(`Status: ${response.status}`);
    if (response.ok) {
      console.log('✅ Registration page is accessible');
    } else {
      console.log('❌ Registration page is not accessible');
    }
  } catch (error) {
    console.log('❌ Failed to access registration page:', error.message);
  }

  // Test 2: Test NextAuth signin endpoint directly
  console.log('\n--- Test 2: NextAuth Signin Endpoint ---');
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    console.log(`\nTesting registration for: ${user.name}`);
    
    try {
      // Test the NextAuth signin endpoint
      const response = await fetch('http://localhost:3000/api/auth/signin/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: user.name,
          email: user.email,
          password: user.password,
          callbackUrl: 'http://localhost:3000/diet-form',
          json: 'true'
        })
      });
      
      console.log(`Status: ${response.status}`);
      console.log(`Status Text: ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Registration successful!');
        console.log('Response:', JSON.stringify(data, null, 2));
      } else {
        console.log('❌ Registration failed');
        const errorText = await response.text();
        console.log('Error:', errorText.substring(0, 200) + '...');
      }
      
    } catch (error) {
      console.log('❌ Test failed with error:', error.message);
    }
  }
  
  // Test 3: Test form validation
  console.log('\n--- Test 3: Form Validation ---');
  
  // Test invalid email
  try {
    const response = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name: 'Invalid User',
        email: 'invalid-email',
        password: 'password123',
        callbackUrl: 'http://localhost:3000/diet-form',
        json: 'true'
      })
    });
    
    console.log(`Invalid email test - Status: ${response.status}`);
    if (!response.ok) {
      console.log('✅ Correctly rejected invalid email');
    }
  } catch (error) {
    console.log('❌ Invalid email test failed:', error.message);
  }
  
  // Test missing required fields
  try {
    const response = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: 'missingname@example.com',
        password: 'password123',
        callbackUrl: 'http://localhost:3000/diet-form',
        json: 'true'
      })
    });
    
    console.log(`Missing name test - Status: ${response.status}`);
    if (!response.ok) {
      console.log('✅ Correctly rejected missing name');
    }
  } catch (error) {
    console.log('❌ Missing name test failed:', error.message);
  }

  // Test 4: Check database connection
  console.log('\n--- Test 4: Database Connection Test ---');
  try {
    const response = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name: 'DB Test User',
        email: 'dbtest@example.com',
        password: 'TestPass123!',
        callbackUrl: 'http://localhost:3000/diet-form',
        json: 'true'
      })
    });
    
    console.log(`Database test - Status: ${response.status}`);
    if (response.status === 500) {
      console.log('❌ Database connection issue detected');
    } else if (response.ok) {
      console.log('✅ Database connection working');
    } else {
      console.log('⚠️ Registration failed but not due to database');
    }
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  }
}

// Run the tests
testRegistration().catch(console.error); 