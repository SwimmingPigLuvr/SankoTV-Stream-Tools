<script>
	import Directory from "$lib/components/Directory.svelte";
</script>

<main class="flex justify-between w-full">
	<div class="fixed w-1/4">
		<Directory />
	</div>
	<div class="ml-auto w-full md:w-3/4">
		<slot />
	</div>
</main>
