import * as cheerio from "cheerio";
import { dateFromItalianTime, toTitleCase } from "$lib/utils/utils"

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

        const rawTime = dateFromItalianTime(
            Number(time.substring(0, 2)),
            Number(time.substring(3, 5)),
            Number(time.substring(6, 8))
        )

        // Inserisco i dati
        const key = rawLine + dest;
        let current = temp[key] ?? {
            line,
            branch: rawLine.endsWith("/"),
            shield: getShieldColorFromLine(line.replace("/", "")),
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

const getShieldColorFromLine = (line: string): Color => {
    const isValpolcevera = (l: number) => (l >= 270 && l <= 277) || [7, 8, 57, 63, 65, 74].includes(l)
    const isValbisagno = (l: number) => (l >= 46 && l <= 49) || (l >= 381 && l <= 482) || [13, 14, 34, 37, 82, 84, 356].includes(l)
    const isPonente = (l: number) => (l >= 93 && l <= 199) || [1, 3, 5, 6, 18, 20, 51, 52, 53, 59, 62, 66, 71].includes(l)
    const isLevante = (l: number) => (l >= 42 && l <= 45) || (l >= 85 && l <= 88) || (l >= 512 && l <= 584) || [15, 16, 17, 31, 36].includes(l)
    const isCentro = (l: number) => [10, 32, 35, 38, 39, 40, 54, 64, 340, 374, 375, 377].includes(l)

    const n = Number(line);

    if(!isNaN(n)) {
        if (isValpolcevera(n)) {
            return "hsl(110, 90%, 30%)";
        } else if (isValbisagno(n)) {
            return "hsl(50, 80%, 55%)";
        } else if (isPonente(n)) {
            return "hsl(6, 80%, 55%)";
        } else if (isLevante(n)) {
            return "hsl(270, 80%, 55%)";
        } else if (isCentro(n)) {
            return "hsl(230, 80%, 55%)";
        }
    }

    // Linee Speciali
    return "#6e6e6e";
}