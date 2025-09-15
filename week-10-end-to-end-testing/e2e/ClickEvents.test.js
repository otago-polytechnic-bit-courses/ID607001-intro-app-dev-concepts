import { expect, test } from '@playwright/test';

test('ClickEvents component - increment and reset functionality', async ({ page }) => {
	await page.goto('/');

	// Test initial state
	const countText = page.locator('p').filter({ hasText: 'Count:' });
	await expect(countText).toHaveText('Count: 0');

	// Test increment button
	const incrementButton = page.locator('button', { hasText: 'Increment Count' });
	await incrementButton.click();
	await expect(countText).toHaveText('Count: 1');

	// Test multiple increments
	await incrementButton.click();
	await incrementButton.click();
	await expect(countText).toHaveText('Count: 3');

	// Test reset button (double-click)
	const resetButton = page.locator('button', { hasText: 'Reset Count' });
	await resetButton.dblclick();
	await expect(countText).toHaveText('Count: 0');

	// Test increment after reset
	await incrementButton.click();
	await expect(countText).toHaveText('Count: 1');
});
