<script lang="ts">
    import { onMount } from "svelte";
    import { weather, temperature } from "$lib/stores/weather";
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
</script>

<header>
    <div>
        <LogoAMT class="h-9 w-9" width="" height="" />
        <time datetime={timeStr}>{timeStr}</time>
    </div>
    <h1>{stationName}</h1>
    <div>
        <p>{$temperature} °C</p>
        <svelte:component this={$weather} class="h-9 w-9" width="" height="" />
    </div>
</header>

<style>
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
