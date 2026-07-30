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
    await expect(page.locator('a[href="/pricing"]').first()).toBeVisible();
  });

  test('pay page loads with query parameters and does not hit 404 SPA route fallback', async ({ page }) => {
    await page.goto('/pay.html?email=test%40example.com&_ptxn=txn_test');
    // Ensure we do not display the 404 custom React Page (NotFound component)
    await expect(page.locator('text=404')).not.toBeVisible();
    await expect(page.locator('text=Page Not Found')).not.toBeVisible();
    
    // Check for pay.html elements: "Subscribe to FLOWNextGen" header
    await expect(page.locator('.brand-name')).toBeVisible();
  });

  test('direct hash entry /#features loads home page without error', async ({ page }) => {
    await page.goto('/#features');
    await expect(page).toHaveTitle(/Flow NextGen/);
    // Home page main components should render
    await expect(page.locator('#features')).toBeVisible();
  });
});
