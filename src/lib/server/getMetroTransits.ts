import * as cheerio from "cheerio";
import { dateFromItalianTime, toTitleCase } from "$lib/utils/utils"

export default async function (station: StationInfo): Promise<Array<Transit>> {
    const now = new Date();
    const req = await fetch(`https://www.amt.genova.it/amt/servizi/orari_xml.php?linea=mm&gg=${now.getDate()}&mm=${now.getMonth() + 1}&aa=${now.getFullYear()}`, {
        cache: 'force-cache',
    });
    const timetablesXML = await req.text();

    // Interpreto il risultato
    const $ = cheerio.load(timetablesXML);

    // Partenze raw
    const ascDepartureRaw = $("trattaasc > partenze").eq(0).text();
    const discDepartureRaw = $("trattadisc > partenze").eq(0).text();

    // Costruisco i transiti per senso di marcia
    const asc: Transit = {
        line: 'M',
        branch: false,
        departure: station.asc.terminus,
        dest: toTitleCase(station.asc.dest),
        forecasts: getForecastFromDelay(
            ascDepartureRaw,
            station.asc.delay
        ),
    };

    const disc: Transit = {
        line: 'M',
        branch: false,
        departure: station.disc.terminus,
        dest: toTitleCase(station.disc.dest),
        forecasts: getForecastFromDelay(
            discDepartureRaw,
            station.disc.delay,
        ),
    };

    return [asc, disc];
}

function getForecastFromDelay(spacedDepartureTimes: string, delayInSecond: number, forecastsLimit = 3): Array<Date> {
    const now = new Date().getTime();
    const departureTimes = spacedDepartureTimes.split(' ');

    let forecasts: Array<Date> = [];

    for (let i = 0; i < departureTimes.length && forecastsLimit > 0; i++) {
        const rawTime = dateFromItalianTime(
            Number(departureTimes[i].substring(0, 2)),
            Number(departureTimes[i].substring(3, 5)),
            0
        )

        // Aggiungo il delay
        const delayed = rawTime.getTime() + delayInSecond * 1000;

        // Se è maggiore di ora lo aggiungo alla lista
        if (delayed > now) {
            forecasts.push(new Date(delayed));
            forecastsLimit--;
        }
    }


    return forecasts;
}