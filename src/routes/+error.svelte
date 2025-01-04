<script lang="ts">
    import { page } from "$app/state";
	import Button from "$lib/components/ui/button/button.svelte";

</script>

<svelte:head>
    <title>{page.error?.message}</title>
</svelte:head>

<main class=" w-full h-screen flex flex-col justify-center items-center gap-3 bg-gray-300  p-2">
    <h2 class=" font-roboto text-2xl font-bold">{page.status} | {page.error?.message}</h2>
    <Button href="/">back</Button>
</main>