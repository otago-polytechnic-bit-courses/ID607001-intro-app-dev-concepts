// /src/routes/server-side/simple-api/+page.server.js

export const load = async ({ fetch }) => {
	try {
		const res = await fetch('https://jsonplaceholder.typicode.com/users');
		const data = await res.json();

		return {
			users: data,
			error: null
		};
	} catch (err) {
		return {
			users: [],
			error: err.message
		};
	}
};
