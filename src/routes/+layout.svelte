<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css'
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Snippet } from 'svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { Notifications } from "@tadashi/svelte-notification"

	let { children,data }:{
		children:Snippet,
		data:PageData,
	} = $props();

</script>

<Notifications/>
<header class=" w-full h-[60px] flex items-center justify-between px-2 fixed top-0 shadow-md z-10">
	<h1 class=" text-2xl font-bold font-roboto">image galery</h1>
	{#if data.user}
		<form action="?/logout" method="post" use:enhance>
			<Button type="submit">logout</Button>
		</form>
	{/if}
</header>
{@render children()}
