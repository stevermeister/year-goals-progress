import { test, expect } from '@playwright/test';

test('homepage has title and loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page has loaded
  await expect(page).toHaveTitle(/Year Goals Progress/);
  
  // Basic test to ensure the page loads
  await expect(page.locator('body')).toBeTruthy();
});
