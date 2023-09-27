import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import getBusTransits from "$lib/server/getBusTransits"
import { sortTransits } from '$lib/utils/utils';
import { deserializeBusStopsFromParam } from '$lib/utils/serialize';


export const GET: RequestHandler = async ({ params, setHeaders }) => {
    const stopIDs = deserializeBusStopsFromParam(params.stop);
    let busTransitsPromises = [], transits: Array<Transit> = [];

    // Itero fermate collegate
    for (const bs of stopIDs)
        busTransitsPromises.push(
            getBusTransits(bs).then(t => transits.push(...t))
        );

    // Aspetto fine caricamento bus e ordino i transiti
    await Promise.all(busTransitsPromises);
    transits = sortTransits(transits);

    // Cache valida per 1 minuto
    setHeaders({
        'Cache-Control': 'max-age=60',
        'Age': new Date().getUTCSeconds().toString(),
    });

    return json(transits);
};