import fetch from 'node-fetch';

const VERCEL_URL = 'https://meal4v-cbdlw5m4b-sinamrts-projects.vercel.app';

class VercelDatabaseTester {
  constructor() {
    this.testResults = [];
    this.testUsers = [];
  }

  async logTest(testName, status, details = '') {
    const result = {
      test: testName,
      status,
      details,
      timestamp: new Date().toISOString()
    };
    this.testResults.push(result);
    console.log(`[${status}] ${testName}: ${details}`);
  }

  async testApplicationAccess() {
    console.log('\n🔍 Method 1: Application Access Test');
    try {
      const response = await fetch(VERCEL_URL);
      
      if (response.status === 401) {
        await this.logTest('Application Access', 'BLOCKED', 'Vercel authentication enabled');
        return false;
      } else if (response.ok) {
        await this.logTest('Application Access', 'PASS', 'Application accessible');
        return true;
      } else {
        await this.logTest('Application Access', 'FAIL', `Status: ${response.status}`);
        return false;
      }
    } catch (error) {
      await this.logTest('Application Access', 'ERROR', error.message);
      return false;
    }
  }

  async testDatabaseWrite() {
    console.log('\n📝 Method 2: Database Write Test (User Registration)');
    
    const testUser = {
      name: 'DB Test User',
      email: `db-test-${Date.now()}@example.com`,
      password: 'TestPass123!'
    };

    try {
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

      if (response.ok) {
        await this.logTest('Database Write', 'PASS', `User created: ${testUser.email}`);
        this.testUsers.push(testUser);
        return true;
      } else if (response.status === 500) {
        const errorText = await response.text();
        await this.logTest('Database Write', 'FAIL', `Database error: ${errorText.substring(0, 100)}`);
        return false;
      } else {
        await this.logTest('Database Write', 'FAIL', `Status: ${response.status}`);
        return false;
      }
    } catch (error) {
      await this.logTest('Database Write', 'ERROR', error.message);
      return false;
    }
  }

  async testDatabaseRead() {
    console.log('\n📖 Method 3: Database Read Test (User Login)');
    
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

      if (response.ok) {
        await this.logTest('Database Read', 'PASS', 'Admin user login successful');
        return true;
      } else if (response.status === 500) {
        await this.logTest('Database Read', 'FAIL', 'Database connection error');
        return false;
      } else {
        await this.logTest('Database Read', 'FAIL', `Status: ${response.status}`);
        return false;
      }
    } catch (error) {
      await this.logTest('Database Read', 'ERROR', error.message);
      return false;
    }
  }

  async testAPIDatabaseEndpoints() {
    console.log('\n🔌 Method 4: API Database Endpoints Test');
    
    const endpoints = [
      { path: '/api/auth/[...nextauth]', name: 'NextAuth API' },
      { path: '/api/places', name: 'Places API' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${VERCEL_URL}${endpoint.path}`);
        
        if (response.ok) {
          await this.logTest(endpoint.name, 'PASS', 'Endpoint responding');
        } else if (response.status === 500) {
          await this.logTest(endpoint.name, 'FAIL', 'Database error');
        } else {
          await this.logTest(endpoint.name, 'FAIL', `Status: ${response.status}`);
        }
      } catch (error) {
        await this.logTest(endpoint.name, 'ERROR', error.message);
      }
    }
  }

  async testDatabaseConnectionHealth() {
    console.log('\n💚 Method 5: Database Connection Health Check');
    
    try {
      // Test a simple database operation through the registration endpoint
      const response = await fetch(`${VERCEL_URL}/api/auth/signin/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: 'Health Check',
          email: `health-${Date.now()}@test.com`,
          password: 'Health123!',
          callbackUrl: `${VERCEL_URL}/diet-form`,
          json: 'true'
        })
      });

      if (response.status === 200) {
        await this.logTest('Database Health', 'PASS', 'Connection healthy');
        return true;
      } else if (response.status === 500) {
        const errorText = await response.text();
        if (errorText.includes('database') || errorText.includes('connection')) {
          await this.logTest('Database Health', 'FAIL', 'Database connection issue');
        } else {
          await this.logTest('Database Health', 'FAIL', 'Unknown error');
        }
        return false;
      } else {
        await this.logTest('Database Health', 'FAIL', `Status: ${response.status}`);
        return false;
      }
    } catch (error) {
      await this.logTest('Database Health', 'ERROR', error.message);
      return false;
    }
  }

  generateReport() {
    console.log('\n📊 Database Test Report');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const errors = this.testResults.filter(r => r.status === 'ERROR').length;
    const blocked = this.testResults.filter(r => r.status === 'BLOCKED').length;

    console.log(`Total Tests: ${this.testResults.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`🚫 Blocked: ${blocked}`);
    console.log(`💥 Errors: ${errors}`);

    console.log('\n📋 Detailed Results:');
    this.testResults.forEach(result => {
      const icon = {
        'PASS': '✅',
        'FAIL': '❌',
        'ERROR': '💥',
        'BLOCKED': '🚫'
      }[result.status];
      
      console.log(`${icon} ${result.test}: ${result.details}`);
    });

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (blocked > 0) {
      console.log('1. Disable Vercel Authentication Protection in dashboard');
      console.log('2. Redeploy the application');
      console.log('3. Run tests again');
    }
    
    if (failed > 0) {
      console.log('4. Check DATABASE_URL environment variable');
      console.log('5. Verify Neon database is accessible');
      console.log('6. Check Prisma schema and migrations');
    }

    if (passed === this.testResults.length) {
      console.log('🎉 All tests passed! Database is working correctly.');
    }
  }

  async runAllTests() {
    console.log('🗄️ Vercel Database Testing Methodology');
    console.log('='.repeat(50));
    
    // Check if application is accessible first
    const isAccessible = await this.testApplicationAccess();
    
    if (!isAccessible) {
      console.log('\n⚠️ Cannot test database - Application access blocked');
      console.log('💡 Please disable Vercel Authentication Protection first');
      this.generateReport();
      return;
    }

    // Run all database tests
    await this.testDatabaseWrite();
    await this.testDatabaseRead();
    await this.testAPIDatabaseEndpoints();
    await this.testDatabaseConnectionHealth();
    
    this.generateReport();
  }
}

// Run the comprehensive test
const tester = new VercelDatabaseTester();
tester.runAllTests().catch(console.error); 