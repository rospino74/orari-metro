import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import getMetroTransits from "$lib/server/getMetroTransits"
import stops from "$lib/server/stops"


export const GET: RequestHandler = async ({ params }) => {
    const stationName = params.station;
    const station = stops[stationName];
    if (!station) {
        throw error(400, 'Station name not valid!');
    }
    const transits = await getMetroTransits(station);
    return json(transits);
};