<script lang="ts">
    import type { PageData } from "./$types";

    import Header from "$lib/components/Header.svelte";
    import TransitForecast from "$lib/components/TransitForecast.svelte";
    import Spacer from "$lib/components/Spacer.svelte";
    import MessageBanner from "$lib/components/MessageBanner.svelte";
    import ScrollOverflow from "$lib/components/ScrollOverflow.svelte";
    import { invalidateAll } from "$app/navigation";
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
                invalidateAll();
            }, 60 * 1000); // Ogni Minuto
        }, secondsRemaining * 1000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    });
</script>

<main>
    <div class="header">
        <Header stationName={data.name} />
    </div>
    <div class="content">
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
    </div>
    <div class="footer">
        <MessageBanner
            type="warn"
            messages={[
                "Causa lavori i treni diretti a Brignole terminano a Caricamento",
                "Ascensori non funzionati a Sarzano Sant'Agostino",
            ]}
        />
    </div>
</main>

<style>
    main {
        @apply h-full;
    }

    .header {
        @apply h-24;
    }

    .content {
        @apply h-[calc(100%-theme(space.24)*2)] px-16 py-8 flex flex-col gap-4;
    }

    .footer {
        @apply h-24 bg-yellow-400;
    }
</style>
