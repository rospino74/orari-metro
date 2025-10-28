<script lang="ts">
    import type { LayoutData } from "../$types";

    import Header from "$lib/components/Header.svelte";
    import MessageBanner from "$lib/components/MessageBanner.svelte";
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";

    export let data: LayoutData;
    const { name, messages, weather } = data;

    onMount(() => {
        const updateWeatherInterval = setInterval(() => {
            invalidate('/api/metro/weather');
        }, 3600000); // Ogni ora
        const updateMessagesInterval = setInterval(() => {
            invalidate('/api/metro/messages');
        }, 600000); // Ogni 10 minuti

        return () => {
            clearInterval(updateWeatherInterval);
            clearInterval(updateMessagesInterval);
        };
    });

</script>

<main>
    <div class="header">
        <Header stationName={name} weather={weather} />
    </div>
    <div class="content">
        <slot />
    </div>
    {#if messages && messages.warnings.length > 0}
        <div
            class="footer"
            transition:slide={{
                duration: 1000,
                easing: quintOut,
                axis: "y",
            }}
        >
            <MessageBanner type="warn" messages={messages.warnings} />
        </div>
    {:else if messages && messages.info.length > 0}
        <div
            class="footer"
            transition:slide={{
                duration: 1000,
                easing: quintOut,
                axis: "y",
            }}
        >
            <MessageBanner type="info" messages={messages.info} />
        </div>
    {/if}
</main>

<style>
    @reference "../../../app.css";
    
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
