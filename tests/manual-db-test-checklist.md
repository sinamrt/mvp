# 🗄️ Manual Database Testing Checklist for Vercel

## **Prerequisites**
- [ ] Vercel Authentication Protection disabled
- [ ] Application redeployed after disabling protection
- [ ] Environment variables configured correctly

## **Step 1: Application Access Test**
- [ ] Navigate to: `https://meal4v-cbdlw5m4b-sinamrts-projects.vercel.app`
- [ ] **Expected**: Application loads without authentication prompt
- [ ] **If 401 Error**: Disable Vercel Authentication Protection

## **Step 2: Registration Page Test**
- [ ] Navigate to: `/register`
- [ ] **Expected**: Registration form loads
- [ ] **Test Fields**:
  - [ ] Name field accepts input
  - [ ] Email field accepts valid email format
  - [ ] Password field accepts input
  - [ ] Confirm password field works

## **Step 3: User Registration Test**
- [ ] Fill registration form with test data:
  - Name: "Test User"
  - Email: "test@example.com"
  - Password: "TestPass123!"
- [ ] Submit form
- [ ] **Expected**: User created successfully, redirected to diet form
- [ ] **If Error**: Check browser console for database errors

## **Step 4: Database Write Verification**
- [ ] Try registering same email again
- [ ] **Expected**: Error message about existing user
- [ ] **This confirms**: Database write operations working

## **Step 5: Login Test**
- [ ] Navigate to login page or try logging in
- [ ] Use test credentials:
  - Email: "test@example.com"
  - Password: "TestPass123!"
- [ ] **Expected**: Successful login
- [ ] **This confirms**: Database read operations working

## **Step 6: Admin User Test**
- [ ] Try logging in with admin credentials:
  - Email: "admin@dietapp.com"
  - Password: "admin123"
- [ ] **Expected**: Admin login successful
- [ ] **This confirms**: Seeded data exists in database

## **Step 7: API Endpoints Test**
- [ ] Test NextAuth endpoint: `/api/auth/[...nextauth]`
- [ ] **Expected**: Endpoint responds (may redirect to login)
- [ ] Test Places API: `/api/places`
- [ ] **Expected**: API responds (may require authentication)

## **Step 8: Error Handling Test**
- [ ] Try invalid email format
- [ ] **Expected**: Form validation error
- [ ] Try weak password
- [ ] **Expected**: Password validation error
- [ ] Try missing required fields
- [ ] **Expected**: Required field validation

## **Step 9: Database Connection Health**
- [ ] Monitor browser network tab during registration
- [ ] **Check for**:
  - [ ] No 500 errors
  - [ ] Successful API responses
  - [ ] Proper redirects after registration

## **Step 10: Performance Test**
- [ ] Time registration process
- [ ] **Expected**: Registration completes within 5 seconds
- [ ] **If Slow**: May indicate database connection issues

## **Troubleshooting Guide**

### **If Registration Fails:**
1. Check browser console for errors
2. Verify DATABASE_URL in Vercel environment variables
3. Check Neon database status
4. Review Vercel function logs

### **If Login Fails:**
1. Verify user was created in database
2. Check password hashing
3. Verify NextAuth configuration

### **If API Endpoints Fail:**
1. Check Prisma client generation
2. Verify database schema
3. Check environment variables

### **If Application Won't Load:**
1. Disable Vercel Authentication Protection
2. Redeploy application
3. Check deployment status

## **Success Criteria**
- [ ] Application loads without authentication
- [ ] User registration works
- [ ] User login works
- [ ] Admin user exists and can login
- [ ] No 500 errors in console
- [ ] All API endpoints respond
- [ ] Database operations complete within reasonable time

## **Test Results**
- [ ] **Pass**: All criteria met
- [ ] **Partial**: Some criteria met, issues identified
- [ ] **Fail**: Critical issues prevent testing

## **Notes**
- Record any errors or unexpected behavior
- Document response times
- Note any console errors
- Save test user credentials for future testing 