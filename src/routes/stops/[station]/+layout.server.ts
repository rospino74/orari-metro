import type { LayoutServerLoad } from './$types';
import stops from "$lib/server/stops";
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, fetch, depends }) => {
    const stationID = params.station;
    const station = stops[stationID];

    // Utilizzato in invalidate
    depends('custom:station-info');

    if (!station) {
        throw error(400, 'Station name not valid!');
    }

    let status: StationStatus = {
        name: station.name,
        weather: 'cloudy',
        temperature: 23,
    };

    return status;
};