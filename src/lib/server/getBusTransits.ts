import * as cheerio from "cheerio";
import { toTitleCase } from "$lib/utils/utils"

export default async function (stop: BusStop): Promise<Array<Transit>> {
    let code;
    if (typeof stop === "object") {
        code = stop.id;
    } else {
        code = stop;
    }

    const req = await fetch(`https://www.amt.genova.it/amt/servizi/passaggi_xml.php?CodiceFermata=${code.toString().padStart(4, '0')}`);
    const xmlTransits = await req.text();

    // Interpreto il risultato
    const $ = cheerio.load(xmlTransits);
    const previsioniElements = $("previsione");

    // Archivio Temporaneo
    let temp: Record<string, Transit> = {};
    for (let i = 0; i < previsioniElements.length; i++) {
        const el = previsioniElements.eq(i);
        const rawLine = el.children("linea").text();
        const line = rawLine.replace(/^0+/gm, "");

        // Controllo se c'è un errore, ritorno nessun transito
        if (rawLine === "*ERR*")
            throw new Error(`Error fetching bus forecasts for stop ${code}`);

        // Contollo se la line è esclusa
        if (typeof stop === "object" && stop.exclude.includes(line))
            continue;

        const dest = toTitleCase(el.children("destinazione").text().replace("\.", ". ").trim());
        const departure = el.children("previsionepartenza").text() === "true";
        const time = el.children("oraarrivo").text();

        const rawTime = new Date();
        rawTime.setHours(
            Number(time.substring(0, 2)),
            Number(time.substring(3, 5)),
            Number(time.substring(6, 8)),
            0
        )

        // Inserisco i dati
        const key = rawLine + dest;
        let current = temp[key] ?? {
            line,
            branch: rawLine.endsWith("/"),
            dest,
            departure,
            forecasts: []
        };
        current.forecasts.push(rawTime);

        // Aggiorno la tabella
        temp[key] = current;
    }

    return Object.values(temp);
}
