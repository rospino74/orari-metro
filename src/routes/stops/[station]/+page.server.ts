import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import getMetroTransits from "$lib/server/getMetroTransits"
import getBusTransits from "$lib/server/getBusTransits"
import stops from "$lib/server/stops"
import { sortTransits } from '$lib/utils/utils';

export const load: PageServerLoad = async ({ params }) => {
	const stopID = params.station;
	const station = stops[stopID];

	if (!station) {
		throw error(400, 'Station name not valid!');
	}

	let out: StationData = {
		name: station.name,
		weather: 'cloudy',
		temperature: 20,
		busTransits: [],
		metroTransits: [],
	}

	// Prendo info transiti metro
	out.metroTransits = await getMetroTransits(station);

	// Itero fermate collegate
	for (const bs of station.nearBusStops ?? [])
		out.busTransits!.push(
			...(await getBusTransits(bs))
		);

	// E ordino i transiti
	out.busTransits = sortTransits(out.busTransits!);
	out.metroTransits = sortTransits(out.metroTransits);

	return out;
};