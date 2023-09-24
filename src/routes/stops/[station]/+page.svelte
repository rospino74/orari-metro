<script lang="ts">
    import type { PageData } from "./$types";

    import Header from "$lib/components/Header.svelte";
    import TransitForecast from "$lib/components/TransitForecast.svelte";
    import Spacer from "$lib/components/Spacer.svelte";
    import MessageBanner from "$lib/components/MessageBanner.svelte";
    import ScrollOverflow from "$lib/components/ScrollOverflow.svelte";
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";

    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";

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

<svelte:head>
    <title>Transiti a {data.name}</title>
</svelte:head>

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
    {#if data.warnings && data.warnings.length > 0}
        <div
            class="footer"
            transition:slide={{
                duration: 1000,
                easing: quintOut,
                axis: "y",
            }}
        >
            <MessageBanner type="warn" messages={data.warnings} />
        </div>
    {:else if data.info && data.info.length > 0}
        <div
            class="footer"
            transition:slide={{
                duration: 1000,
                easing: quintOut,
                axis: "y",
            }}
        >
            <MessageBanner type="info" messages={data.info} />
        </div>
    {/if}
</main>

<style>
    main {
        @apply h-full;
    }

    .header {
        @apply h-24;
    }

    .content {
        @apply h-[calc(100%-theme(space.24))] px-16 py-8 flex flex-col gap-4;
    }

    .footer {
        @apply h-24 w-full bg-yellow-400 absolute bottom-0 left-0;
    }
</style>
