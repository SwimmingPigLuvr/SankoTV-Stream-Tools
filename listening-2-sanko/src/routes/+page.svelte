<script>
	import AnimationHandler from "$lib/components/AnimationHandler.svelte";
</script>

<div class="text-white items-center p-8 w-full h-screen flex flex-col">
	<h1 class="font-sans text-5xl flex space-x-1">
		<span class="text-red-600">S</span>
		<span class="text-blue-600">A</span>
		<span class="text-lime-600">N</span>
		<span class="text-yellow-600">K</span>
		<span class="text-white-600">O</span>
		<span class="text-lime-400">.tv</span>
	</h1>
	<h2 class="">CHAT TOOLS</h2>
	
	<!-- links -->
	<div class="m-auto flex space-x-2">
		<a class="rounded border-white border-2 w-32 text-center h-10 items-center flex justify-center" href="/emotes">emotes</a>
		<a class="rounded border-white border-2 w-32 text-center h-10 items-center flex justify-center" href="/gifts">gifts</a>
	</div>
	<AnimationHandler />
	<p class="fixed bottom-2 text-xs">by <span class="text-sky-300">swimming</span> 🐷 ❤️r</p>
</div>
