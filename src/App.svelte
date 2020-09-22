<script>
	import Timer from './components/Timer.svelte';
	import NewTimer from './components/NewTimerForm.svelte';
	import { db } from "./stores/db.js";
	import { activeTimers } from "./stores/activeTimers.js";
	import { fade, fly } from "svelte/transition";
	import { flip } from 'svelte/animate';

</script>

<svelte:head>
	{#if $activeTimers === 0}
		<title>🥚Timer</title>
	{/if}
</svelte:head>

<main>
	<header>
		<h1>
			{#if $activeTimers === 0}
				<span>🥚Timer</span>
		{:else}
				<span>🐣Timer</span>
			{/if}
		</h1>
	</header>
	<ul>
		<li><NewTimer /></li>
		{#each $db as t, index (t.tid)}
		<li in:fly={{y:-(index+1)*60, duration:100 + (index+1)*60}}
				out:fade={{duration:100}}
				animate:flip="{{duration: 200}}">
			<Timer  tid={t.tid} initialTime={t.time} name={t.name}/>
		</li>
		{/each}
	</ul>
</main>
<style>
	main {
		padding-left: 100px;
		padding-right: 100px;
	}
	header, li {
		display: flex;
		justify-content: center;
	}
</style>