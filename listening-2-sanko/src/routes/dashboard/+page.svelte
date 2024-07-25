<script>
	import { isDarkMode } from "$lib/stores";
</script>

<main
	class="{$isDarkMode
		? 'bg-slate-900 text-white'
		: 'bg-white text-slate-900'} h-screen w-full fixed top-0 left-0"

></main>
