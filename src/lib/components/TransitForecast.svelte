<script lang="ts">
    import ScrollOverflow from "./ScrollOverflow.svelte";
    import { getCorrectTextColor } from "$lib/utils/colors";
    import { padEndArray } from "$lib/utils/utils";

    export let transit: Transit;

    $: shieldTextColor = getCorrectTextColor(transit.shield);
    $: forecasts = transit.forecasts
        .map((fc: Date) => {
            // https://stackoverflow.com/a/52931503
            fc = new Date(fc);

            const now = new Date().getTime();
            const minuteDifference = Math.floor((fc.getTime() - now) / 60000);

            if (minuteDifference < 1) {
                return transit.departure ? "Partenza" : "Arrivo";
            }

            return `${minuteDifference} min`;
        })
        .slice(0, 3);
</script>

<div>
    <span>
        <p
            style="--shield-color: {transit.shield}; --text-color: {shieldTextColor};"
            class:branch={transit.branch}
        >
            {transit.line.replace("/", "")}
        </p>
    </span>
    <ScrollOverflow class="dest">{transit.dest}</ScrollOverflow>
    <ul>
        {#each padEndArray(3, "", forecasts) as fc}
            <li>{fc}</li>
        {/each}
    </ul>
</div>

<style>
    @reference "../../app.css";
    
    div {
        @apply flex gap-4 items-center w-full;
    }

    p {
        @apply text-3xl font-medium min-w-[4rem] w-16 h-16 text-center table-cell align-middle rounded-xl uppercase;
        background-color: var(--shield-color);
        color: var(--text-color);
    }

    p:global(.branch) {
        background: linear-gradient(
            -45deg,
            var(--shield-color) 45%,
            rgba(255, 255, 255, 0.2) 45%,
            rgba(255, 255, 255, 0.2) 55%,
            var(--shield-color) 55%
        );
    }

    :global(.dest) {
        @apply text-6xl font-medium mr-auto grow-[2];
        line-height: 1.2;
    }

    ul {
        @apply h-full list-none grid grid-cols-3 gap-8;
    }

    li {
        @apply font-light text-3xl text-neutral-700 flex items-center justify-end w-32;
    }

    li:first-child {
        @apply font-normal text-4xl text-white;
    }
</style>
