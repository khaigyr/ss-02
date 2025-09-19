<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="max-w-[800px] mx-auto p-6 flex flex-col gap-12">
{@render children?.()}

</div>