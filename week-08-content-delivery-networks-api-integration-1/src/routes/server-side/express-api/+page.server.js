// /routes/server-side/express-api/+page.server.js

import { env } from '$env/dynamic/private';

const API_BASE_URL = env.API_BASE_URL || 'http://localhost:3000';

export const load = async ({ fetch }) => {
	try {
		const res = await fetch(`${API_BASE_URL}/api/institutions`);
		const institutions = await res.json();

		return {
			institutions,
			error: null
		};
	} catch (err) {
		return {
			institutions: [],
			error: err.message
		};
	}
};

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const region = data.get('region');
		const country = data.get('country');
		const institution = { name, region, country };

		try {
			const res = await fetch(`${API_BASE_URL}/api/institutions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(institution)
			});

			const institutions = await res.json();

			return { success: true, message: institutions.message };
		} catch (err) {
			console.log(err);
			return { success: false, error: err.message };
		}
	}
};
