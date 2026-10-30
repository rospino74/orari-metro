import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import getMetroTransits from "#lib/server/getMetroTransits.js"
import stops from "#lib/server/stops.js"
import { sortTransits } from '#lib/utils/utils.js';


export const GET: RequestHandler = async ({ params, setHeaders }) => {
    const stationID = params.station;
    const station = stops[stationID];

    if (!station) {
        throw error(400, 'Station ID not valid!');
    }
    
    let transits = await getMetroTransits(station);
    transits = sortTransits(transits);

    // Cache valida per 1 minuto
    setHeaders({
        'Cache-Control': 'max-age=60',
        'Age': new Date().getUTCSeconds().toString(),
    });

    return Response.json(transits);
};
