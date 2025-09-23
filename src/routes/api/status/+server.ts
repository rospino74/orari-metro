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

        // Tolgo "Ascensore", "Funicolare" e "Cremagliera" dal nome della linea visto che il tipo è già presente in affectedKind
        affectedLines = affectedLines.map((linea) => linea.replace(/(ascensor[ei](?: di)?|funicolare|cremagliera)\s+/i, ''));

        let message = messaggio;

        // Se ci sono più linee specificate, rimuovo il nome dall'inizio del messaggio perché è ridondante
        if (affectedLines.length > 1 || categoria !== 'SG') {
            message = message.replace(/.*?:/, '');
        } else {
            message = message.replace(',', ', ');
        }

        // Rende maiuscole tutte le lettere dopo dopo i punto e spazio
        message = message.replace(/\.\s+([a-z])/g, (_, letter) => `. ${letter.toUpperCase()}`).trim();

        // Rende la prima lettera maiuscola
        message = message.charAt(0).toUpperCase() + message.slice(1);

        // Aggiusto gli accenti
        message = message.replace('a\'', 'à').replace('e\'', 'è').replace('i\'', 'ì');

        // Metto il punto finale se non c'è
        if (!message.endsWith('.')) {
            message += '.';
        }

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
        'Cache-Control': 'max-age=1800, s-maxage=900, stale-if-error=900, public',
        'Access-Control-Allow-Origin': '*',
    });

    return json(out);
};