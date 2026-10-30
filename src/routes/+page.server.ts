import type { PageServerLoad } from './$types';
import stops from "#lib/server/stops.js"

export const prerender = true;

export const load: PageServerLoad = () => {
	const pageRoutes = Object.entries(stops)
		.map(
			([key, { name }]) => ({ name, url: `/stops/${key}` })
		);
	return { pageRoutes };
}
