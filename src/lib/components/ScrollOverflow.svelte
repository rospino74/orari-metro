<script lang="ts">
    import { afterUpdate } from "svelte";

    let className: string = "";
    export { className as class };
    export let direction: "x" | "y" = "x";
    export let speedPercentagePerSecond: number = 15;
    export let continuos: boolean = true;

    let overflowGuard: HTMLElement,
        scrollingBlock: HTMLElement,
        shouldScrolling: boolean,
        timing: number;

    afterUpdate(() => {
        let totalAnimationLength: number;
        if (direction === "x") {
            shouldScrolling = overflowGuard.offsetWidth < overflowGuard.scrollWidth;
            totalAnimationLength = scrollingBlock.scrollWidth;
        } else {
            shouldScrolling = overflowGuard.offsetHeight < overflowGuard.scrollHeight;
            totalAnimationLength = scrollingBlock.scrollHeight;
        }
        timing = totalAnimationLength / speedPercentagePerSecond;
    });
</script>

<div bind:this={overflowGuard} class="guard {className}">
    <div
        bind:this={scrollingBlock}
        class:scroll={shouldScrolling}
        class="marquee {direction}"
        style="--scrolling-animation-duration: {timing}s;"
    >
        <slot />
    </div>
    {#if shouldScrolling && continuos}
        <div
            bind:this={scrollingBlock}
            class:scroll={shouldScrolling}
            class="marquee {direction}"
            style="--scrolling-animation-duration: {timing}s;"
            aria-hidden="true"
            role="note"
        >
            <slot />
        </div>
    {/if}
</div>

<style>
    @reference "../../app.css";
    
    .guard {
        @apply overflow-hidden;
    }

    @keyframes marqueeX {
        0% {
            transform: translateX(0%);
        }
        99.99999% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(0%);
        }
    }

    @keyframes marqueeY {
        0% {
            transform: translateY(0%);
        }
        99.99999% {
            transform: translateY(-100%);
        }
        100% {
            transform: translateY(0%);
        }
    }

    .marquee {
        @apply flex items-center w-max h-full list-none;
    }
    
    .marquee.x {
        @apply w-max h-full;
    }
    
    .marquee.y {
        @apply h-max w-full flex-col;
    }

    .marquee.scroll {
        animation-duration: var(--scrolling-animation-duration);
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        @apply will-change-transform;
    }

    .marquee.x.scroll {
        animation-name: marqueeX;
    }

    .marquee.y.scroll {
        animation-name: marqueeY;
    }
</style>
