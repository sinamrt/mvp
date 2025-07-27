# Manual Testing Guide - Diet Management App Components

## Overview
This guide provides step-by-step instructions for manually testing the 5 core components of the diet management application without requiring data input or external dependencies.

## Prerequisites
- Docker containers running (`docker compose up -d`)
- Application accessible at `http://localhost:3000`
- Adminer accessible at `http://localhost:8080` (for database verification)

---

## Test Case 1: PlaceCard Component Basic Rendering

### Objective
Verify the PlaceCard component renders correctly with different prop combinations.

### Test Steps

#### 1.1 Basic Name Rendering
1. **Navigate to**: `http://localhost:3000`
2. **Expected Result**: 
   - Page loads without errors
   - Search interface is visible
   - No JavaScript console errors

#### 1.2 Component Structure Verification
1. **Open Browser Developer Tools** (F12)
2. **Go to Elements/Inspector tab**
3. **Search for elements with class or structure matching PlaceCard**
4. **Expected Result**:
   - Should find div elements with styling
   - Should see h3 elements for place names
   - Should see paragraph elements for ratings
   - Should see small elements for types

#### 1.3 Visual Verification
1. **Look for any place cards on the page**
2. **Expected Result**:
   - Cards have proper spacing and borders
   - Text is readable and properly formatted
   - No overlapping elements

---

## Test Case 2: Component Structure Validation

### Objective
Verify proper HTML structure and styling of components.

### Test Steps

#### 2.1 HTML Structure Analysis
1. **Open Browser Developer Tools** (F12)
2. **Inspect the main page structure**
3. **Check for semantic HTML elements**
4. **Expected Result**:
   - Proper heading hierarchy (h1, h2, h3)
   - Semantic div containers
   - Proper form elements if present

#### 2.2 CSS Styling Verification
1. **Inspect element styles in Developer Tools**
2. **Check for CSS properties**
3. **Expected Result**:
   - Consistent padding and margins
   - Proper border styling
   - Background colors applied correctly
   - Responsive design elements

#### 2.3 Layout Consistency
1. **Resize browser window** (test responsiveness)
2. **Check different screen sizes**
3. **Expected Result**:
   - Layout adapts to different screen sizes
   - No horizontal scrolling issues
   - Elements remain properly aligned

---

## Test Case 3: Edge Cases and Error Handling

### Objective
Test component behavior with edge cases and error conditions.

### Test Steps

#### 3.1 Empty Data Handling
1. **Navigate to**: `http://localhost:3000`
2. **Clear any existing search results**
3. **Expected Result**:
   - Page loads without errors
   - No broken images or missing elements
   - Graceful handling of empty states

#### 3.2 JavaScript Error Handling
1. **Open Browser Developer Tools** (F12)
2. **Go to Console tab**
3. **Refresh the page**
4. **Expected Result**:
   - No JavaScript errors in console
   - No failed network requests
   - Clean console output

#### 3.3 Network Error Simulation
1. **Disconnect internet temporarily**
2. **Refresh the page**
3. **Expected Result**:
   - Page loads with basic functionality
   - No critical errors
   - Graceful degradation

---

## Test Case 4: Accessibility Testing

### Objective
Ensure components meet basic accessibility standards.

### Test Steps

#### 4.1 Keyboard Navigation
1. **Use Tab key to navigate through the page**
2. **Use Enter/Space to activate elements**
3. **Expected Result**:
   - All interactive elements are reachable
   - Focus indicators are visible
   - Logical tab order

#### 4.2 Screen Reader Compatibility
1. **Enable screen reader** (if available)
2. **Navigate through the page**
3. **Expected Result**:
   - Headings are properly announced
   - Form labels are associated with inputs
   - Meaningful text alternatives

#### 4.3 Color and Contrast
1. **Check text contrast against backgrounds**
2. **Verify color is not the only way to convey information**
3. **Expected Result**:
   - Sufficient color contrast
   - Information not solely dependent on color

---

## Test Case 5: Data Display Validation

### Objective
Verify data is displayed correctly in various formats.

### Test Steps

#### 5.1 Text Display Verification
1. **Look for any text content on the page**
2. **Check for proper text formatting**
3. **Expected Result**:
   - Text is readable and properly sized
   - No text overflow or clipping
   - Proper font rendering

#### 5.2 Special Characters Handling
1. **Look for any special characters in text**
2. **Check for proper encoding**
3. **Expected Result**:
   - Special characters display correctly
   - No encoding issues
   - Proper Unicode support

#### 5.3 Responsive Text Display
1. **Resize browser window**
2. **Check text scaling**
3. **Expected Result**:
   - Text scales appropriately
   - No text becomes unreadable
   - Proper line wrapping

---

## Additional Verification Tests

### Database Connection Test
1. **Navigate to**: `http://localhost:8080`
2. **Login with**:
   - System: PostgreSQL
   - Server: postgres
   - Username: diet_user
   - Password: diet_password
   - Database: diet_management
3. **Expected Result**:
   - Successfully connect to database
   - See available tables
   - No connection errors

### API Endpoint Test
1. **Navigate to**: `http://localhost:3000/api/places`
2. **Expected Result**:
   - Returns JSON response
   - No 404 or 500 errors
   - Proper API structure

### Authentication Flow Test
1. **Look for sign-in/sign-out buttons**
2. **Check authentication status display**
3. **Expected Result**:
   - Authentication UI elements are present
   - No authentication-related errors
   - Proper session handling

---

## Test Results Documentation

### Test Execution Checklist
- [ ] Test Case 1: PlaceCard Component Basic Rendering
- [ ] Test Case 2: Component Structure Validation
- [ ] Test Case 3: Edge Cases and Error Handling
- [ ] Test Case 4: Accessibility Testing
- [ ] Test Case 5: Data Display Validation

### Issues Found
Document any issues discovered during testing:
- **Issue Description**:
- **Steps to Reproduce**:
- **Expected vs Actual Behavior**:
- **Severity** (High/Medium/Low):
- **Browser/Environment**:

### Test Environment
- **Browser**: [Chrome/Firefox/Safari/Edge]
- **Version**: [Browser version]
- **OS**: [Operating System]
- **Screen Resolution**: [Resolution]
- **Date**: [Test date]

---

## Success Criteria

### All tests pass if:
1. ✅ No JavaScript errors in console
2. ✅ All components render correctly
3. ✅ Proper HTML structure maintained
4. ✅ Accessibility features working
5. ✅ Responsive design functional
6. ✅ Database connection successful
7. ✅ API endpoints responding
8. ✅ Authentication flow available

### Critical Issues (Must Fix):
- JavaScript errors preventing functionality
- Database connection failures
- API endpoint errors
- Authentication system failures

### Minor Issues (Should Fix):
- Visual styling inconsistencies
- Accessibility improvements needed
- Performance optimizations
- Code quality improvements 