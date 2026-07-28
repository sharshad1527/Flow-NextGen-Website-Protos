import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Flow NextGen Website', () => {
  test('homepage loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Flow NextGen/);
  });

  test('pricing page loads and shows heading', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('guide page loads', async ({ page }) => {
    await page.goto('/guide');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('404 page shows not-found message', async ({ page }) => {
    await page.goto('/nonexistent');
    await expect(page.locator('text=404').or(page.locator('text=not found', { ignoreCase: true })).first()).toBeVisible();
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('refund page loads', async ({ page }) => {
    await page.goto('/refund');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('no critical accessibility violations on homepage', async ({ page }) => {
    await page.goto('/');
    // Wait for lazy-loaded content to render
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(v => v.impact === 'critical');
    expect(critical.length).toBe(0);
  });

  test('no critical accessibility violations on pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(v => v.impact === 'critical');
    expect(critical.length).toBe(0);
  });

  test('navigation links are reachable', async ({ page }) => {
    await page.goto('/');
    // Verify key navigation links exist
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
    await expect(page.locator('a[href="/pricing"], nav:has(a[href*="pricing"])')).toBeVisible();
  });
});
