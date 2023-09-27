import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import getMetroTransits from "$lib/server/getMetroTransits"
import stops from "$lib/server/stops"
import { sortTransits } from '$lib/utils/utils';
import { serializeBusStopsAsParam } from '$lib/utils/serialize';

export const load: PageServerLoad = async ({ params, fetch }) => {
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
	const metroTransitsPromise = getMetroTransits(station).then(transits => {
		out.metroTransits = sortTransits(transits);
	});

	// Itero fermate collegate
	if (station.nearBusStops && station.nearBusStops.length > 0) {
		out.busTransits = await fetch(`/api/bus/${encodeURIComponent(serializeBusStopsAsParam(station.nearBusStops))}`).then(r => r.json());
	}

	// Aspetto fine caricamento transiti metro
	await metroTransitsPromise;
	return out;
};

