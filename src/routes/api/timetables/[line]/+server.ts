import type { RequestHandler } from './$types';
import { error, text } from '@sveltejs/kit';
import { dateFromItalianTime } from '$lib/utils/utils';

export const GET: RequestHandler = async ({ params, fetch, url, setHeaders }) => {
    const lineID = params.line;

    if (!lineID) {
        return error(400, 'Line ID not valid!');
    }

    // Preparo la data da parametri di query
    const date = new Date();

    const month = parseInt(url.searchParams.get('month')) || date.getMonth() + 1;
    const year = parseInt(url.searchParams.get('year')) || date.getFullYear();
    const day = parseInt(url.searchParams.get('day')) || date.getDate();

    if (month < 1 || month > 12) {
        return error(400, 'Month not valid!');
    }

    if (day < 1 || day > 31 ||
        (month === 2 && day > 29) ||
        ([4, 6, 9, 11].includes(month) && day > 30)
    ) {
        return error(400, 'Day not valid!');
    }


    const req = await fetch(`https://www.amt.genova.it/amt/servizi/orari_xml.php?linea=${encodeURIComponent(lineID)}&gg=${day}&mm=${month}&aa=${year}`);

    if (!req.ok) {
        return error(502, 'Invalid response from the provider!');
    }

    // Se è l'orario di oggi cache valida per 30 minuti, nel passato cache valida per 30 giorni, nel futuro cache valida fino alla mezzanotte di oggi
    let cacheDuration: number, age = 0;
    if (day === date.getDate() && month === date.getMonth() + 1 && year === date.getFullYear()) {
        cacheDuration = 1800;
    } else if (dateFromItalianTime(0, 0, 0, day, month, year) < date) {
        cacheDuration = 2592000;
    } else {
        cacheDuration = 86400;
        age = Math.floor((dateFromItalianTime(23, 59, 59, day, month, year).getTime() - date.getTime()) / 1000);
    }

    setHeaders({
        'Cache-Control': `max-age=${cacheDuration}, s-maxage=${Math.floor(cacheDuration / 2)}, stale-if-error=${Math.floor(cacheDuration / 2)}, public`,
        'Age': age.toString(),
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/xml',
    });

    return text(await req.text());
};