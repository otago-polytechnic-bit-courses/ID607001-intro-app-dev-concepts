// /src/routes/register/+page.server.js

import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';

const API_BASE_URL = env.API_BASE_URL || 'http://localhost:3000';

export const actions = {
	register: async ({ request }) => {
		const formData = await request.formData();
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const emailAddress = formData.get('emailAddress');
		const password = formData.get('password');
		const role = formData.get('role');
		const user = { firstName, lastName, emailAddress, password, role };

		try {
			const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			});

			const data = await res.json();

			if (!res.ok) {
				return fail(409, {
					success: false,
                    error: data.message,
					errors: data.errors,
					firstName,
					lastName,
					emailAddress,
                    password,
					role
				});
			}

			return { success: true, message: data.message };
		} catch (err) {
			return fail(500, {
                success: false,
                error: err.message,
                firstName,
                lastName,
                emailAddress,
                password,
                role
            });
		}
	}
};
