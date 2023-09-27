<script lang="ts">
    import type { PageData } from "./$types";

    import TransitForecast from "$lib/components/TransitForecast.svelte";
    import Spacer from "$lib/components/Spacer.svelte";
    import ScrollOverflow from "$lib/components/ScrollOverflow.svelte";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";

    export let data: PageData;

    onMount(() => {
        const now = new Date();
        let secondsRemaining = 60 - now.getSeconds();

        // Per ottimizzare le richieste se i secondi rimanenti sono pochi non aggiorno la pagina
        if (secondsRemaining < 15) secondsRemaining += 60;

        let interval: number;
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                invalidate("custom:transits");
            }, 60 * 1000); // Ogni Minuto
        }, secondsRemaining * 1000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    });
</script>

<svelte:head>
    <title>Transiti a {data.name}</title>
</svelte:head>

{#each data.metroTransits as t}
    <TransitForecast transit={t} shield="#e84330" />
{/each}
{#if data.busTransits && data.busTransits.length > 0}
    <Spacer>
        <h2>Collegamenti con Bus</h2>
    </Spacer>
    <ScrollOverflow direction="y" speedPercentagePerSecond={10}>
        {#each data.busTransits as t}
            <TransitForecast transit={t} shield="#0f8a24" />
        {/each}
    </ScrollOverflow>
{/if}
