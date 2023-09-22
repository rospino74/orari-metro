<script lang="ts">
    import type { PageData } from "./$types";
    export let data: PageData;
</script>

<ul>
    {#each data.pageRoutes as { name, url }}
        <li>
            <a href={url}>{name}</a>
        </li>
    {/each}
</ul>

<style lang="postcss">
    ul {
        @apply list-item;
    }

    a {
        @apply underline text-blue-400 hover:text-blue-200 transition-colors;
    }
</style>
