import { writable } from 'svelte/store';

// Weather Icons
import CloudyDay from '~icons/material-symbols/partly-cloudy-day-outline-rounded';
import CloudyNight from '~icons/material-symbols/nights-stay-outline-rounded';
import ClearDay from '~icons/material-symbols/sunny-outline-rounded';
import ClearNight from 'virtual:icons/material-symbols/bedtime-outline-rounded';
import Rainy from 'virtual:icons/material-symbols/rainy-outline';
import Snowy from 'virtual:icons/material-symbols/ac-unit-rounded';

type WeatherIcon = CloudyDay | CloudyNight | ClearDay | ClearNight | Rainy | Snowy;

export const weather = (() => {
    const { subscribe, set: storeSet } = writable<WeatherIcon>(CloudyDay);

    const setIconFromWeatherString = (w: Weather = 'cloudy') => {
        // Prendo l'ora corrente
        const hour = new Date().getHours();
        const isNight = hour > 19 && hour < 6;

        let icon: WeatherIcon;
        switch(w) {
            case 'snowy':
                icon = Snowy;
            break;
            case 'rainy':
                icon = Rainy;
            break;
            case 'clear':
                icon = isNight ? ClearNight : ClearDay;
            break;
            case 'cloudy':
                icon = isNight ? CloudyNight : CloudyDay;
            break;
        }

        storeSet(icon);
    };

    return {
        subscribe,
        reset: () => setIconFromWeatherString('cloudy'),
        set: setIconFromWeatherString,
    };
})();

export const temperature = writable(0);
