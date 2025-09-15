// /e2e/FormEvents.test.js
import { expect, test } from '@playwright/test';

test('FormEvents component form - interactions and submission', async ({ page }) => {
	await page.goto('/');

	const messageText = page.locator('form').locator('+ p');
	const usernameInput = page.locator('#username');
	const firstNameInput = page.locator('#firstName');
	const lastNameInput = page.locator('#lastName');
	const submitButton = page.locator('button[type="submit"]');

	// Test initial state (message should be empty)
	await expect(messageText).toHaveText('');

	// Test focus event
	await usernameInput.focus();
	await expect(messageText).toHaveText('Username input field focused');

	// Test input event
	await usernameInput.fill('john_doe');
	await expect(messageText).toHaveText('You typed john_doe');

	// Test blur event
	await usernameInput.blur();
	await expect(messageText).toHaveText('Username input field lost focus');

	// Fill out complete form
	await usernameInput.fill('testuser');
	await firstNameInput.fill('John');
	await lastNameInput.fill('Doe');

	// Test form submission
	await submitButton.click();
	await expect(messageText).toHaveText(
		'Form successfully submitted. Info: Username: testuser, First Name: John, Last Name: Doe'
	);
});
