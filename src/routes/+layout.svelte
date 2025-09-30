<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link href="https://api.fontshare.com/v2/css?f[]=satoshi@1,2&display=swap" rel="stylesheet">
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="max-w-[940px] mx-auto p-6 flex flex-col gap-8">
{@render children?.()}

</div>