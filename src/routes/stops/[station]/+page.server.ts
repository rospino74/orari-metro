import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import stops from "$lib/server/stops"
import { serializeBusStopsAsParam } from '$lib/utils/serialize';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const stationID = params.station;
	const station = stops[stationID];

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
	const metroTransitsPromise = fetch(`/api/metro/${stationID}`)
		.then(r => r.json())
		.then(transits => {
			out.metroTransits = transits;
		});

	// Itero fermate collegate
	if (station.nearBusStops && station.nearBusStops.length > 0) {
		out.busTransits = await fetch(`/api/bus/${encodeURIComponent(serializeBusStopsAsParam(station.nearBusStops))}`).then(r => r.json());
	}

	// Aspetto fine caricamento transiti metro
	await metroTransitsPromise;
	return out;
};

