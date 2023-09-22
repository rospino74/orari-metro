<script lang="ts">
    // Icone
    import WarningIcon from "virtual:icons/material-symbols/warning-outline-rounded";
    import InfoIcon from "virtual:icons/material-symbols/info-outline-rounded";
    import ScrollOverflow from "./ScrollOverflow.svelte";

    // Proprietà
    export let type: "warn" | "info", messages: Array<string>;
</script>

<footer class={type}>
    <svelte:component
        this={type === "warn" ? WarningIcon : InfoIcon}
        height=""
        width=""
        class="icon h-9 self-center"
    />
    <ScrollOverflow continuos={false}>
            {#each messages as msg}
                <span>{msg}</span>
            {/each}
    </ScrollOverflow>
</footer>

<style>
    footer {
        @apply w-full h-full py-4 px-8 flex gap-4;
    }

    footer.warn {
        @apply text-black bg-yellow-400;
    }

    footer.info {
        @apply text-white bg-blue-500;
    }

    :global(.icon) {
        @apply h-9 w-9 self-center;
    }

    span {
        @apply inline text-4xl float-left;
    }

    span:not(:last-child)::after {
        content: "―";
        @apply mx-4 opacity-50 font-light;
    }
</style>
