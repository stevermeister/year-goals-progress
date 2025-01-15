import { test, expect } from '@playwright/test';

test.describe('Year Goals Progress App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage has correct title and initial elements', async ({ page }) => {
    await expect(page).toHaveTitle('Year Goals Progress');
    await expect(page.getByText('You haven\'t added any goals yet.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Your First Goal' })).toBeVisible();
  });

  test('can add a new goal', async ({ page }) => {
    // Click add goal button
    await page.getByRole('button', { name: 'Add Your First Goal' }).click();
    
    // Fill the form
    await page.getByPlaceholder('Goal Title').fill('Test Goal');
    await page.locator('.range-inputs input').first().fill('0');
    await page.locator('.range-inputs input').last().fill('100');
    
    // Submit the form
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify the goal was added
    await expect(page.getByText('Test Goal')).toBeVisible();
    await expect(page.getByText('100', { exact: true })).toBeVisible();
  });

  test('can update goal progress', async ({ page }) => {
    // First add a goal
    await page.getByRole('button', { name: 'Add Your First Goal' }).click();
    await page.getByPlaceholder('Goal Title').fill('Progress Test Goal');
    await page.locator('.range-inputs input').first().fill('0');
    await page.locator('.range-inputs input').last().fill('100');
    await page.getByRole('button', { name: 'Save' }).click();

    // Update progress using +1 button
    await page.getByRole('button', { name: '+1' }).click();

    // Verify progress updated
    await expect(page.getByText('1', { exact: true })).toBeVisible();
    await expect(page.locator('.progressbar-container')).toBeVisible();
  });

  test('can remove a goal', async ({ page }) => {
    // Set up dialog handler before triggering action
    page.once('dialog', dialog => dialog.accept());

    // First add a goal
    await page.getByRole('button', { name: 'Add Your First Goal' }).click();
    await page.getByPlaceholder('Goal Title').fill('Goal to Remove');
    await page.locator('.range-inputs input').first().fill('0');
    await page.locator('.range-inputs input').last().fill('100');
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify goal exists
    await expect(page.getByText('Goal to Remove')).toBeVisible();

    // Remove the goal
    await page.locator('.remove-goal-button').click();

    // Wait for the goal to be removed and verify
    await page.waitForSelector('text=Goal to Remove', { state: 'hidden' });
  });

  test('handles decreasing goals correctly', async ({ page }) => {
    // Add a decreasing goal
    await page.getByRole('button', { name: 'Add Your First Goal' }).click();
    await page.getByPlaceholder('Goal Title').fill('Weight Loss Goal');
    await page.locator('.range-inputs input').first().fill('100');
    await page.locator('.range-inputs input').last().fill('80');
    await page.getByRole('button', { name: 'Save' }).click();

    // Update progress using -1 button
    await page.getByRole('button', { name: '-1' }).click();

    // Verify progress updated
    await expect(page.getByText('99', { exact: true })).toBeVisible();
    await expect(page.locator('.progressbar-container')).toBeVisible();
  });

  test('can clear all goals', async ({ page }) => {
    // Set up dialog handler before triggering action
    page.once('dialog', dialog => dialog.accept());

    // First add a goal
    await page.getByRole('button', { name: 'Add Your First Goal' }).click();
    await page.getByPlaceholder('Goal Title').fill('Sample Goal');
    await page.locator('.range-inputs input').first().fill('0');
    await page.locator('.range-inputs input').last().fill('100');
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify goal exists
    await expect(page.getByText('Sample Goal')).toBeVisible();

    // Click the clear link
    await page.locator('.data-action-link.danger').click();

    // Verify goal was removed and we see the empty state
    await expect(page.getByText('You haven\'t added any goals yet.')).toBeVisible();
  });
});
