// /src/routes/server-side/express-api/+page.server.js

import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';

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
		const formData = await request.formData();
		const name = formData.get('name');
		const region = formData.get('region');
		const country = formData.get('country');
		const institution = { name, region, country };

		try {
			const res = await fetch(`${API_BASE_URL}/api/institutions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(institution)
			});

			const data = await res.json();

			if (!res.ok) {
				return fail(409, { errors: data.errors, name, region, country });
			}

			return { success: true, message: data.message };
		} catch (err) {
			return fail(500, {
				success: false,
				error: err.message,
				name,
				region,
				country
			});
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		
		try {
			const res = await fetch(`${API_BASE_URL}/api/institutions/${id}`, {
				method: 'DELETE'
			});

			const data = await res.json();

			return { success: true, message: data.message };
		} catch (err) {
			return { success: false, error: err.message };
		}
	}
};
