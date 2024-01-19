import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { dateFromItalianTime } from '$lib/utils/utils';

type Stato = { stato?: Array<{ evento: string, categoria: string, linee: string | string[], causa: string, data: string, messaggio: string }> }

export const GET: RequestHandler = async ({ setHeaders, fetch }) => {
    const messages: Stato = await fetch('https://www.amt.genova.it/amt/servizi/app/stato_servizio_v2.php').then((r: { json: () => any; }) => r.json());
    const { stato } = messages;

    if (!stato) {
        // Bad Gateway risposta non valida dal server
        return { status: 502 };
    }

    const out = stato.map(({ evento, categoria, linee, messaggio, data }) => {
        // Parsing della data può essere sia G/M/AAAA HH:MM che GG/M/AAAA HH:MM
        const [giorno, mese, anno, ora] = data.split(/\/| /);
        const [minuto, secondo] = ora.split(':').map(Number);

        const date = dateFromItalianTime(minuto, secondo, 0); // Only sets the time
        date.setFullYear(Number(anno));
        date.setMonth(Number(mese) - 1);
        date.setDate(Number(giorno));

        // Le linee possono essere sia un array che una stringa, trasformo in array
        let affectedLines = linee ?? [];
        if (!Array.isArray(affectedLines)) {
            affectedLines = [affectedLines];
        }

        // Tolgo "Ascensore" e "Funicolare" dal nome della linea visto che il tipo è già presente in affectedKind
        affectedLines = affectedLines.map((linea) => linea.replace(/(Ascensore|Funicolare)\s+/, ''));

        // Per il messaggio rimuovi tutti i caratteri prima del primo : e fai maiuscolo dopo il punto e la prima lettera della frase
        let message = messaggio.replace(/.*?:/, '').trim().replace(/\.\s+([a-z])/g, (_, letter) => `. ${letter.toUpperCase()}`);
        message = message.charAt(0).toUpperCase() + message.slice(1);

        return {
            type: evento,
            affectedKind: categoria,
            affectedLines,
            message,
            date,
        };
    });

    // Cache valida per 30 minuti, sul server per 15 minuti e se c'è un errore per ulteriori 15 minuti
    setHeaders({
        'Cache-Control': 'max-age=1800, s-maxage=900, stale-if-error=900, public'
    });

    return json(out);
};