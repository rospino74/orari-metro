<script lang="ts">
    import { onMount, type ComponentType } from "svelte";
    // Weather Icons
    import CloudyDay from "~icons/material-symbols/partly-cloudy-day-outline-rounded";
    import CloudyNight from "~icons/material-symbols/nights-stay-outline-rounded";
    import ClearDay from "~icons/material-symbols/sunny-outline-rounded";
    import ClearNight from "virtual:icons/material-symbols/bedtime-outline-rounded";
    import Rainy from "virtual:icons/material-symbols/rainy-outline";
    import Snowy from "virtual:icons/material-symbols/ac-unit-rounded";

    // Company logo
    import LogoAMT from "virtual:icons/custom/amt";

    // Props
    export let stationName: string;

    // Each second update the timer
    let dateObj = new Date();
    $: timeStr = dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    onMount(() => {
        const interval = setInterval(() => {
            dateObj = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

    export let weather: Weather;

    // Prendo l'ora corrente
    $: isNight = dateObj.getHours() > 19 || dateObj.getHours() < 6;

    let weatherIcon: ComponentType;
    $: switch (weather.condition) {
        case "snowy":
            weatherIcon = Snowy;
            break;
        case "rainy":
            weatherIcon = Rainy;
            break;
        case "clear":
            weatherIcon = isNight ? ClearNight : ClearDay;
            break;
        case "cloudy":
            weatherIcon = isNight ? CloudyNight : CloudyDay;
            break;
    }
</script>

<header>
    <div>
        <LogoAMT class="h-9 w-9" width="" height="" />
        <time datetime={timeStr}>{timeStr}</time>
    </div>
    <h1>{stationName}</h1>
    <div>
        <p>{weather.temperature} °C</p>
        <svelte:component
            this={weatherIcon}
            class="h-9 w-9"
            width=""
            height=""
        />
    </div>
</header>

<style>
    @reference "../../app.css";
    
    header {
        @apply w-full h-full py-4 px-8 flex justify-between items-center border-b-2 border-solid border-b-neutral-700;
    }

    div {
        @apply flex justify-center items-center gap-4;
    }

    p,
    time {
        @apply text-4xl font-light block;
    }

    h1 {
        @apply text-5xl font-medium;
    }
</style>
