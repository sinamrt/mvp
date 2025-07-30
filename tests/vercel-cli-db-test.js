import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class VercelCLIDatabaseTester {
  constructor() {
    this.testResults = [];
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

  async testEnvironmentVariables() {
    console.log('\n🔧 Method 1: Environment Variables Check');
    
    try {
      const { stdout } = await execAsync('vercel env ls');
      
      if (stdout.includes('DATABASE_URL')) {
        await this.logTest('Environment Variables', 'PASS', 'DATABASE_URL configured');
        return true;
      } else {
        await this.logTest('Environment Variables', 'FAIL', 'DATABASE_URL not found');
        return false;
      }
    } catch (error) {
      await this.logTest('Environment Variables', 'ERROR', error.message);
      return false;
    }
  }

  async testDeploymentStatus() {
    console.log('\n🚀 Method 2: Deployment Status Check');
    
    try {
      const { stdout } = await execAsync('vercel ls');
      
      if (stdout.includes('Ready')) {
        await this.logTest('Deployment Status', 'PASS', 'Application deployed successfully');
        return true;
      } else {
        await this.logTest('Deployment Status', 'FAIL', 'Deployment not ready');
        return false;
      }
    } catch (error) {
      await this.logTest('Deployment Status', 'ERROR', error.message);
      return false;
    }
  }

  async testFunctionLogs() {
    console.log('\n📋 Method 3: Function Logs Analysis');
    
    try {
      const { stdout } = await execAsync('vercel logs --limit=50');
      
      if (stdout.includes('database') || stdout.includes('prisma')) {
        await this.logTest('Function Logs', 'PASS', 'Database operations detected in logs');
        return true;
      } else if (stdout.includes('error') || stdout.includes('Error')) {
        await this.logTest('Function Logs', 'FAIL', 'Errors detected in logs');
        return false;
      } else {
        await this.logTest('Function Logs', 'INFO', 'No database operations found in recent logs');
        return true;
      }
    } catch (error) {
      await this.logTest('Function Logs', 'ERROR', error.message);
      return false;
    }
  }

  async testBuildLogs() {
    console.log('\n🔨 Method 4: Build Logs Analysis');
    
    try {
      const { stdout } = await execAsync('vercel logs --limit=100');
      
      if (stdout.includes('prisma generate') && stdout.includes('success')) {
        await this.logTest('Build Process', 'PASS', 'Prisma client generated successfully');
        return true;
      } else if (stdout.includes('prisma') && stdout.includes('error')) {
        await this.logTest('Build Process', 'FAIL', 'Prisma build errors detected');
        return false;
      } else {
        await this.logTest('Build Process', 'INFO', 'No Prisma build information found');
        return true;
      }
    } catch (error) {
      await this.logTest('Build Process', 'ERROR', error.message);
      return false;
    }
  }

  generateReport() {
    console.log('\n📊 Vercel CLI Database Test Report');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const errors = this.testResults.filter(r => r.status === 'ERROR').length;
    const info = this.testResults.filter(r => r.status === 'INFO').length;

    console.log(`Total Tests: ${this.testResults.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`💥 Errors: ${errors}`);
    console.log(`ℹ️ Info: ${info}`);

    console.log('\n📋 Detailed Results:');
    this.testResults.forEach(result => {
      const icon = {
        'PASS': '✅',
        'FAIL': '❌',
        'ERROR': '💥',
        'INFO': 'ℹ️'
      }[result.status];
      
      console.log(`${icon} ${result.test}: ${result.details}`);
    });
  }

  async runAllTests() {
    console.log('🗄️ Vercel CLI Database Testing Methodology');
    console.log('='.repeat(50));
    
    await this.testEnvironmentVariables();
    await this.testDeploymentStatus();
    await this.testFunctionLogs();
    await this.testBuildLogs();
    
    this.generateReport();
  }
}

// Run the Vercel CLI tests
const cliTester = new VercelCLIDatabaseTester();
cliTester.runAllTests().catch(console.error); 