import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

type Stato = { stato?: Array<{ categoria: string, messaggio: string }> }

export const GET: RequestHandler = async ({ setHeaders, fetch }) => {
    const messages: Stato = await fetch('https://www.amt.genova.it/amt/servizi/app/stato_servizio_v2.php').then(r => r.json());
    const { stato } = messages;

    const out: ServiceMessages = {
        warnings: [],
        info: [],
    };

    if (stato) {
        out.warnings = stato.reduce((filtered, { categoria, messaggio }) => {
            if (categoria === "MM") {
                filtered.push(messaggio);
            }
            return filtered;
        }, [] as Array<string>);
    }

    // Cache valida per 30 minuti
    setHeaders({
        'Cache-Control': 'max-age=1800'
    });

    return json(out);
};