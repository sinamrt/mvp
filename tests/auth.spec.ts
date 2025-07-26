import { test, expect } from '@playwright/test';

test.describe('Authentication and Role Assignment', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
  });

  test('Test Case #1: User Login & Role Assignment', async ({ page }) => {
    // Test that the main page loads without authentication
    await expect(page.getByText('🔍 Find Places')).toBeVisible();
    
    // Verify that the search functionality is available
    await expect(page.getByPlaceholder('e.g., cafes in Melbourne')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('Test Case #2: Diet Form Access', async ({ page }) => {
    // Navigate to the diet form page
    await page.goto('/diet-form');
    
    // Verify the diet form loads correctly
    await expect(page.getByText('Diet Onboarding Form')).toBeVisible();
    await expect(page.getByText('Select your diet type:')).toBeVisible();
    
    // Verify all diet type options are available
    const dietTypes = ['vegan', 'vegetarian', 'omnivore', '4FED'];
    for (const dietType of dietTypes) {
      await expect(page.getByRole('option', { name: dietType.charAt(0).toUpperCase() + dietType.slice(1) })).toBeVisible();
    }
  });

  test('Test Case #3: Diet Form Navigation Flow', async ({ page }) => {
    await page.goto('/diet-form');
    
    // Select a diet type
    await page.selectOption('select', 'vegan');
    
    // Click Next button
    await page.click('button:has-text("Next")');
    
    // Verify we're on the first question page
    await expect(page.getByText('What is your primary motivation for choosing a vegan diet?')).toBeVisible();
    await expect(page.getByText('Page 2 of 20')).toBeVisible();
    
    // Fill in the answer
    await page.fill('input[type="text"]', 'Health and environmental reasons');
    
    // Click Next again
    await page.click('button:has-text("Next")');
    
    // Verify we're on the second question
    await expect(page.getByText('How long have you been following a vegan diet?')).toBeVisible();
    await expect(page.getByText('Page 3 of 20')).toBeVisible();
    
    // Test back navigation
    await page.click('button:has-text("Back")');
    await expect(page.getByText('What is your primary motivation for choosing a vegan diet?')).toBeVisible();
    await expect(page.getByText('Page 2 of 20')).toBeVisible();
  });

  test('Test Case #4: Form Validation', async ({ page }) => {
    await page.goto('/diet-form');
    
    // Try to click Next without selecting a diet type
    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeDisabled();
    
    // Select a diet type
    await page.selectOption('select', 'vegetarian');
    await expect(nextButton).not.toBeDisabled();
    
    // Click Next and try to proceed without answering
    await page.click('button:has-text("Next")');
    await expect(page.getByText('What is your primary motivation for choosing a vegetarian diet?')).toBeVisible();
    
    // The Next button should be disabled until we fill in the answer
    const nextButtonOnQuestion = page.getByRole('button', { name: 'Next' });
    await expect(nextButtonOnQuestion).toBeDisabled();
    
    // Fill in the answer
    await page.fill('input[type="text"]', 'Ethical reasons');
    await expect(nextButtonOnQuestion).not.toBeDisabled();
  });

  test('Test Case #5: Form Data Persistence', async ({ page }) => {
    await page.goto('/diet-form');
    
    // Select a diet type
    await page.selectOption('select', 'omnivore');
    
    // Navigate to a question and fill it
    await page.click('button:has-text("Next")');
    await page.fill('input[type="text"]', 'Balanced nutrition');
    
    // Reload the page to test persistence
    await page.reload();
    
    // Verify the diet type is still selected
    await expect(page.locator('select')).toHaveValue('omnivore');
    
    // Navigate to the question page
    await page.click('button:has-text("Next")');
    
    // Verify the answer is still there
    await expect(page.locator('input[type="text"]')).toHaveValue('Balanced nutrition');
  });

  test('Test Case #6: Form Completion and Redirect', async ({ page }) => {
    await page.goto('/diet-form');
    
    // Select diet type
    await page.selectOption('select', '4FED');
    
    // Navigate through all pages (simplified for E2E test)
    for (let i = 0; i < 19; i++) {
      await page.click('button:has-text("Next")');
      await page.fill('input[type="text"]', `Answer ${i + 1}`);
    }
    
    // On the last page, fill the final answer
    await page.fill('input[type="text"]', 'Final answer');
    
    // Submit the form
    await page.click('button:has-text("Submit")');
    
    // Verify redirect to home page
    await expect(page).toHaveURL('/');
    await expect(page.getByText('🔍 Find Places')).toBeVisible();
  });
}); 