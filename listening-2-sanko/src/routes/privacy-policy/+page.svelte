<script>
	import DarkMode from "$lib/components/DarkMode.svelte";
	import { isDarkMode } from "$lib/stores";
</script>

<div class="fixed top-2 left-2 z-10">
	<DarkMode />
</div>
<main
	class="min-h-screen w-full p-6 md:p-8 lg:p-12 {$isDarkMode
		? 'bg-slate-900 text-yellow-100'
		: 'bg-yellow-100 text-slate-800'} font-serif italic tracking-wide"
>
	<div class="max-w-3xl mx-auto">
		<h1 class="text-xl font-mono mb-6">Privacy Policy for StarLabs</h1>
		<p class="mb-4">Last updated: Tuesday July 30, 2024</p>

		<section class="mb-8">
			<h2 class="text-xl font-mono font-semibold mb-4">
				1. Introduction
			</h2>
			<p>
				Welcome to StarLabs. We are committed to protecting your privacy
				and using your data solely for the purpose of providing and
				improving our service.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-xl font-mono font-semibold mb-4">
				2. Data We Collect
			</h2>
			<p>We collect and process only the following data:</p>
			<ul class="list-disc list-inside ml-4 mt-2">
				<li>Email address (provided through Google sign-in)</li>
				<li>Wallet address (when you connect your crypto wallet)</li>
			</ul>
		</section>

		<section class="mb-8">
			<h2 class="text-xl font-mono font-semibold mb-4">
				3. How We Use Your Data
			</h2>
			<p>
				We use your personal data exclusively for the following
				purposes:
			</p>
			<ul class="list-disc list-inside ml-4 mt-2">
				<li>To provide and maintain our service</li>
				<li>To authenticate you and manage your account</li>
				<li>To enable wallet-based interactions within our app</li>
			</ul>
			<p class="mt-2">
				We do not use your data for marketing, analytics, or any purpose
				other than operating the StarLabs service.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-xl font-mono font-semibold mb-4">
				4. Data Storage and Security
			</h2>
			<p>
				We implement appropriate technical measures to protect your
				personal data against unauthorized access, accidental loss, or
				destruction. Your data is stored securely on our servers and is
				only accessed when necessary to provide our service.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-xl font-mono font-semibold mb-4">
				5. Third-Party Sharing
			</h2>
			<p>
				We do not sell, trade, rent, or share your personal information
				with any third parties. The only exception is sharing your email
				with Google for authentication purposes.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-xl font-mono font-semibold mb-4">6. Your Rights</h2>
			<p>You have the right to:</p>
			<ul class="list-disc list-inside ml-4 mt-2">
				<li>Access your personal data</li>
				<li>Correct your personal data</li>
				<li>Delete your account and associated data</li>
			</ul>
			<p class="mt-2">
				To exercise these rights, please contact us using the
				information provided below.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-xl font-mono font-semibold mb-4">
				7. Data Retention
			</h2>
			<p>
				We retain your data only for as long as necessary to provide you
				with our service. If you delete your account, we will delete all
				of your personal data from our servers.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-xl font-mono font-semibold mb-4">
				8. Changes to This Privacy Policy
			</h2>
			<p>
				We may update our Privacy Policy from time to time. We will
				notify you of any changes by posting the new Privacy Policy on
				this page and updating the "Last updated" date.
			</p>
		</section>

		<section class="mb-8">
			<h2 class="text-xl font-mono font-semibold mb-4">9. Contact Us</h2>
			<p>
				If you have any questions about this Privacy Policy or our data
				practices, please contact us at:
			</p>
			<a
				href="https://x.com/SwimmingPigLuvr"
				class="text-blue-500 hover:underline">x.com/SwimmingPigLuvr</a
			>
		</section>
	</div>
</main>
