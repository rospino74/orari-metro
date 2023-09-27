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
	const metroTransitsPromise = getMetroTransits(station).then(transits => {
    out.metroTransits = sortTransits(transits);
  });

	// Itero fermate collegate
  let busTransitsPromises = [];
	for (const bs of station.nearBusStops ?? [])
	  busTransitsPromises.push(
     getBusTransits(bs).then(transits => out.busTransits!.push(...transits))
    );

  // Aspetto fine caricamento bus e ordino i transiti
  await Promise.all(busTransitsPromises);
  out.busTransits = sortTransits(out.busTransits!);

  // Aspetto fine caricamento transiti metro
  await metroTransitsPromise;

	return out;
};