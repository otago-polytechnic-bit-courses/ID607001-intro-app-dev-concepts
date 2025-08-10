// /routes/server-side/simple-api/+page.server.js

export const load = async () => {
	try {
		const res = await fetch('https://jsonplaceholder.typicode.com/users');
		const users = await res.json();

		return {
			users,
			error: null
		};
	} catch (err) {
		return {
			users: [],
			error: err.message
		};
	}
};
