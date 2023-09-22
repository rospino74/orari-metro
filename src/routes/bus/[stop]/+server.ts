import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import getBusTransits from "$lib/server/getBusTransits"


export const GET: RequestHandler = async ({ params }) => {
    const stopNumber = Number(params.stop ?? '-1');
    if (isNaN(stopNumber)) {
        throw error(400, 'Stop id must be a number!');
    }
    const transits = await getBusTransits(stopNumber);
    return json(transits);
};