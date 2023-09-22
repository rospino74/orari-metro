<div>
    <h2><slot /></h2>
</div>
<style>
    div {
        @apply inline-flex items-center;
    }

    div::after, div::before {
        content: '';
        @apply h-0.5 bg-neutral-700 inline-block;
    }

    div::after {
        @apply w-full ml-4 flex-auto;
    }

    div::before {
        @apply w-16 mr-4 flex-[0_1_4rem];
    }

    h2 {
        @apply  text-neutral-500 text-4xl shrink-0;
    }
</style>
