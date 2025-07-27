# **TC-001: User Registration - Manual Testing Guide**

## **📋 Test Overview**
**Test ID:** TC-001  
**Category:** Authentication  
**Priority:** 🔴 CRITICAL (P0)  
**Estimated Time:** 2 hours  
**Complexity:** High  

## **🎯 Test Objectives**
- Verify user registration functionality works correctly
- Test both email-based and OAuth registration methods
- Validate form inputs and error handling
- Ensure security measures are in place
- Test database persistence and data integrity

---

## **🧪 Test Scenarios**

### **TC-001-01: Email-based User Registration**

#### **Test Case 1.1: Valid User Registration**
**Objective:** Test successful registration with valid data

**Prerequisites:**
- Application running at `http://localhost:3000`
- Database accessible
- No existing user with test email

**Test Steps:**
1. Navigate to `http://localhost:3000`
2. Look for "Sign Up" or "Register" button/link
3. Click on registration option
4. Fill in the registration form:
   - **Email:** `testuser@example.com`
   - **Password:** `SecurePassword123!`
   - **Name:** `Test User`
5. Click "Register" or "Sign Up" button
6. Verify successful registration

**Expected Results:**
- ✅ User account is created successfully
- ✅ User is redirected to dashboard or confirmation page
- ✅ User data is stored in database
- ✅ Password is hashed (not stored in plain text)
- ✅ User role is set to "USER" by default

**Pass/Fail Criteria:**
- **PASS:** All expected results achieved
- **FAIL:** Any expected result not achieved

---

#### **Test Case 1.2: Invalid Email Format**
**Objective:** Test registration rejection with invalid email

**Test Steps:**
1. Navigate to registration form
2. Fill in the form with invalid email:
   - **Email:** `invalid-email`
   - **Password:** `SecurePassword123!`
   - **Name:** `Test User`
3. Click "Register" button

**Expected Results:**
- ❌ Registration is rejected
- ❌ Error message displayed: "Invalid email format"
- ❌ No user account created in database
- ❌ Form remains on registration page

**Pass/Fail Criteria:**
- **PASS:** Registration rejected with appropriate error
- **FAIL:** Registration succeeds or no error shown

---

#### **Test Case 1.3: Weak Password**
**Objective:** Test registration rejection with weak password

**Test Steps:**
1. Navigate to registration form
2. Fill in the form with weak password:
   - **Email:** `test@example.com`
   - **Password:** `123`
   - **Name:** `Test User`
3. Click "Register" button

**Expected Results:**
- ❌ Registration is rejected
- ❌ Error message displayed: "Password must be at least 8 characters"
- ❌ No user account created in database

**Pass/Fail Criteria:**
- **PASS:** Registration rejected with password strength error
- **FAIL:** Registration succeeds or no error shown

---

#### **Test Case 1.4: Duplicate Email Registration**
**Objective:** Test registration rejection with existing email

**Prerequisites:**
- User with email `existing@example.com` already exists

**Test Steps:**
1. Navigate to registration form
2. Fill in the form with existing email:
   - **Email:** `existing@example.com`
   - **Password:** `SecurePassword123!`
   - **Name:** `Test User`
3. Click "Register" button

**Expected Results:**
- ❌ Registration is rejected
- ❌ Error message displayed: "Email already registered"
- ❌ No duplicate user account created

**Pass/Fail Criteria:**
- **PASS:** Registration rejected with duplicate email error
- **FAIL:** Registration succeeds or no error shown

---

### **TC-001-02: OAuth User Registration (Google)**

#### **Test Case 2.1: Google OAuth Registration**
**Objective:** Test user registration via Google OAuth

**Prerequisites:**
- Google OAuth configured in application
- Valid Google account available for testing

**Test Steps:**
1. Navigate to `http://localhost:3000`
2. Look for "Sign in with Google" button
3. Click "Sign in with Google"
4. Complete Google OAuth flow:
   - Enter Google credentials
   - Grant permissions to application
5. Verify registration completion

**Expected Results:**
- ✅ User account is created with Google email
- ✅ User is automatically logged in
- ✅ User data is stored in database
- ✅ OAuth provider information is recorded

**Pass/Fail Criteria:**
- **PASS:** OAuth registration works correctly
- **FAIL:** OAuth flow fails or user not created

---

#### **Test Case 2.2: OAuth Account Linking**
**Objective:** Test linking existing email account to OAuth

**Prerequisites:**
- User with email `existing@gmail.com` already exists (email registration)
- Same email used for Google account

**Test Steps:**
1. Ensure user exists via email registration
2. Navigate to application
3. Click "Sign in with Google"
4. Use Google account with same email as existing user
5. Complete OAuth flow

**Expected Results:**
- ✅ Existing user account is linked to Google OAuth
- ✅ User is logged in successfully
- ✅ No duplicate account created
- ✅ OAuth provider information added to existing account

**Pass/Fail Criteria:**
- **PASS:** Account linking works correctly
- **FAIL:** Duplicate account created or linking fails

---

### **TC-001-03: Registration Form Validation**

#### **Test Case 3.1: Required Fields Validation**
**Objective:** Test form validation for required fields

**Test Steps:**
1. Navigate to registration form
2. Leave all fields empty
3. Click "Register" button

**Expected Results:**
- ❌ Form submission is prevented
- ❌ Error messages displayed for all required fields:
  - "Email is required"
  - "Password is required"
  - "Name is required"

**Pass/Fail Criteria:**
- **PASS:** All required field validations work
- **FAIL:** Form submits with empty fields or missing error messages

---

#### **Test Case 3.2: Email Format Validation**
**Objective:** Test various invalid email formats

**Test Data:**
- `test` (no @ symbol)
- `test@` (no domain)
- `@example.com` (no username)
- `test..test@example.com` (double dots)
- `test@example..com` (double dots in domain)

**Test Steps:**
1. For each invalid email format:
   - Fill in registration form with invalid email
   - Use valid password and name
   - Click "Register" button
   - Verify error message

**Expected Results:**
- ❌ All invalid emails rejected
- ❌ Error message: "Invalid email format"

**Pass/Fail Criteria:**
- **PASS:** All invalid emails rejected
- **FAIL:** Any invalid email accepted

---

#### **Test Case 3.3: Password Strength Validation**
**Objective:** Test password strength requirements

**Test Data:**
- `123` (too short)
- `password` (no uppercase/numbers)
- `Password` (no numbers)
- `Password1` (no special characters)
- `pass` (too short)

**Test Steps:**
1. For each weak password:
   - Fill in registration form with weak password
   - Use valid email and name
   - Click "Register" button
   - Verify error message

**Expected Results:**
- ❌ All weak passwords rejected
- ❌ Error message: "Password must be at least 8 characters"

**Pass/Fail Criteria:**
- **PASS:** All weak passwords rejected
- **FAIL:** Any weak password accepted

---

### **TC-001-04: Registration Security**

#### **Test Case 4.1: Password Hashing**
**Objective:** Verify passwords are hashed before storage

**Test Steps:**
1. Register a new user with password `SecurePassword123!`
2. Access database directly (via Adminer at `http://localhost:8080`)
3. Check the `users` table for the new user
4. Verify password field contains hashed value, not plain text

**Expected Results:**
- ✅ Password stored as hash (not plain text)
- ✅ Hash is different from original password
- ✅ Hash follows bcrypt format (starts with `$2b$`)

**Pass/Fail Criteria:**
- **PASS:** Password properly hashed
- **FAIL:** Password stored in plain text

---

#### **Test Case 4.2: Sensitive Data Protection**
**Objective:** Verify sensitive data is not exposed in responses

**Test Steps:**
1. Register a new user
2. Check API response or user object returned
3. Verify sensitive fields are not included

**Expected Results:**
- ✅ No `password` field in response
- ✅ No `passwordHash` field in response
- ✅ Only safe user data returned (id, email, name, role)

**Pass/Fail Criteria:**
- **PASS:** Sensitive data not exposed
- **FAIL:** Password or hash exposed in response

---

### **TC-001-05: Registration Response**

#### **Test Case 5.1: Successful Registration Response**
**Objective:** Verify correct response format for successful registration

**Test Steps:**
1. Register a new user with valid data
2. Check the response/redirect behavior
3. Verify user data in response

**Expected Results:**
- ✅ Success response or redirect to dashboard
- ✅ User object contains: `id`, `email`, `name`, `role`
- ✅ No sensitive data in response
- ✅ User is automatically logged in

**Pass/Fail Criteria:**
- **PASS:** Correct response format and data
- **FAIL:** Incorrect response or missing data

---

## **📊 Test Results Summary**

| **Test Case** | **Status** | **Pass/Fail** | **Notes** |
|---------------|------------|---------------|-----------|
| **1.1 Valid Registration** | ⏳ Pending | - | - |
| **1.2 Invalid Email** | ⏳ Pending | - | - |
| **1.3 Weak Password** | ⏳ Pending | - | - |
| **1.4 Duplicate Email** | ⏳ Pending | - | - |
| **2.1 Google OAuth** | ⏳ Pending | - | - |
| **2.2 OAuth Linking** | ⏳ Pending | - | - |
| **3.1 Required Fields** | ⏳ Pending | - | - |
| **3.2 Email Validation** | ⏳ Pending | - | - |
| **3.3 Password Validation** | ⏳ Pending | - | - |
| **4.1 Password Hashing** | ⏳ Pending | - | - |
| **4.2 Data Protection** | ⏳ Pending | - | - |
| **5.1 Response Format** | ⏳ Pending | - | - |

**Overall Test Status:** ⏳ **PENDING**  
**Pass Rate:** 0/12 (0%)  
**Estimated Completion:** 2 hours  

---

## **🔧 Test Environment Setup**

### **Required Tools:**
- Web browser (Chrome, Firefox, Safari)
- Database access (Adminer at `http://localhost:8080`)
- Test email accounts
- Google account for OAuth testing

### **Test Data:**
- **Valid Emails:** `test@example.com`, `user123@gmail.com`
- **Invalid Emails:** `invalid-email`, `test@`, `@example.com`
- **Strong Passwords:** `SecurePassword123!`, `MyPass123!@#`
- **Weak Passwords:** `123`, `password`, `Password1`

### **Database Verification:**
- **Table:** `users`
- **Key Fields:** `id`, `email`, `name`, `passwordHash`, `role`
- **Expected Role:** `USER` (default)

---

## **📝 Notes & Observations**

### **Current Application State:**
- NextAuth.js configured with Google, GitHub, and Email providers
- Prisma schema includes User model with proper fields
- Database tables created and ready for testing

### **Potential Issues:**
- Registration UI components may need to be created
- Email provider configuration may need setup
- OAuth provider credentials may need configuration

### **Next Steps:**
1. Verify registration UI exists and is accessible
2. Test each scenario systematically
3. Document any issues or missing functionality
4. Update test results as tests are completed

---

**Test Executed By:** [Tester Name]  
**Date:** [Date]  
**Environment:** Development (localhost:3000)  
**Browser:** [Browser Version] 