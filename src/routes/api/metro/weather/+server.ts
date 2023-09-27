import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { OPENWEATHER_API_KEY } from '$env/static/private';

export const GET: RequestHandler = async ({ params, setHeaders, fetch }) => {
    // Genova
    const lat = 44.4101042, lon = 8.9240217;

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`).then(r => r.json());
    const { weather, main } = res;

    const conditionID: number = weather[0].id;
    let condition = 'cloudy';
    if (conditionID < 600) {
        condition = 'rainy';
    } else if (conditionID > 800) {
        condition = 'cloudy';
    } else if (conditionID == 800) {
        condition = 'clear';
    } else if (conditionID >= 600 && conditionID < 700) {
        condition = 'snowy';
    }

    // Cache valida per 1 ora
    setHeaders({
        'Cache-Control': 'max-age=3600'
    });

    let temperature: number;
    if (typeof main.temp !== "number") {
        temperature = Number(main.temp);
    }
    else {
        temperature = main.temp;
    }
    temperature = Math.round(temperature);


    return json({
        condition,
        temperature,
    } as Weather);
};