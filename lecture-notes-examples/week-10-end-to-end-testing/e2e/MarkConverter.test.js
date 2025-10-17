// /e2e/MarkConverter.test.js
import { expect, test } from '@playwright/test';

test('MarkConverter component - grade calculation', async ({ page }) => {
	await page.goto('/');

	const markInput = page.locator('input[type="number"]');
	const gradeText = page.locator('p').filter({ hasText: 'Grade:' });

	// Test initial state (mark = 75)
	await expect(gradeText).toHaveText('Grade: B+');

	// Test A+ grade
	await markInput.fill('95');
	await expect(gradeText).toHaveText('Grade: A+');

	// Test A grade
	await markInput.fill('88');
	await expect(gradeText).toHaveText('Grade: A');

	// Test A- grade
	await markInput.fill('82');
	await expect(gradeText).toHaveText('Grade: A-');

	// Test B+ grade
	await markInput.fill('77');
	await expect(gradeText).toHaveText('Grade: B+');

	// Test B grade
	await markInput.fill('72');
	await expect(gradeText).toHaveText('Grade: B');

	// Test B- grade
	await markInput.fill('67');
	await expect(gradeText).toHaveText('Grade: B-');

	// Test C+ grade
	await markInput.fill('62');
	await expect(gradeText).toHaveText('Grade: C+');

	// Test C grade
	await markInput.fill('57');
	await expect(gradeText).toHaveText('Grade: C');

	// Test C- grade
	await markInput.fill('52');
	await expect(gradeText).toHaveText('Grade: C-');

	// Test D grade
	await markInput.fill('45');
	await expect(gradeText).toHaveText('Grade: D');

	// Test E grade (fail)
	await markInput.fill('35');
	await expect(gradeText).toHaveText('Grade: E');

	// Test boundary conditions
	await markInput.fill('90');
	await expect(gradeText).toHaveText('Grade: A+');

	await markInput.fill('89');
	await expect(gradeText).toHaveText('Grade: A');

	await markInput.fill('40');
	await expect(gradeText).toHaveText('Grade: D');

	await markInput.fill('39');
	await expect(gradeText).toHaveText('Grade: E');
});
