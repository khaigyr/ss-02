<script>
	let { data } = $props();
	let { sessions } = data;

	let status = $state('stopped');

	let elapsed = $state(0),
		duration = $state(0);

	let subject = $state(),
		rating = $state();

	let mins = $derived(Math.floor(elapsed / 1000 / 60) % 60),
		secs = $derived(Math.floor(elapsed / 1000) % 60);

	let interval;

	function start() {
		if (status === 'running') return;

		status = 'running';
		const startTime = Date.now() - elapsed;

		interval = setInterval(() => {
			elapsed = Date.now() - startTime;
		}, 1000);
	}

	function pause() {
		if (status !== 'running') return;

		clearInterval(interval);
		status = 'paused';
	}

	function stop() {
		if (status === 'stopped') return;

		clearInterval(interval);
		duration = elapsed;
		status = 'finished';
	}
</script>

{#if status === 'stopped'}
	<button
		onclick={start}
		class="grid h-56 place-items-center rounded-2xl bg-neutral-900 text-neutral-100"
	>
		<div class="flex flex-col gap-2">
			<span class="flex justify-center gap-2">
				<!-- Book icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-8"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z"
					/>
				</svg>
			</span>
			<span class="text-2xl font-bold">Start Study Timer</span>
		</div>
	</button>
{:else if status === 'running' || status === 'paused'}
	<div class="grid h-[90dvh] place-items-center rounded-2xl bg-neutral-900 text-neutral-100">
		<div class="flex flex-col gap-8">
			<p class="text-center text-6xl font-bold">
				{mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
			</p>
			<div class="flex justify-center gap-4">
				<button class="flex items-center gap-2" title="stop" onclick={stop}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="size-5 fill-neutral-400"
					>
						<rect width="10" height="10" x="3" y="3" rx="1.5" />
					</svg>
					Stop and save
				</button>
				{#if status === 'paused'}
					<button class="flex items-center gap-2" title="continue" onclick={start}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="size-5 fill-neutral-400"
						>
							<path
								d="M3 3.732a1.5 1.5 0 0 1 2.305-1.265l6.706 4.267a1.5 1.5 0 0 1 0 2.531l-6.706 4.268A1.5 1.5 0 0 1 3 12.267V3.732Z"
							/>
						</svg>
						Continue
					</button>
				{:else}
					<button class="flex items-center gap-2" title="pause" onclick={pause}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="size-5 fill-neutral-400"
						>
							<path
								d="M4.5 2a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-1ZM10.5 2a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-1Z"
							/>
						</svg>
						Pause
					</button>
				{/if}
			</div>
		</div>
	</div>
{:else if status === 'finished'}
	<form
		method="post"
		action="?/saveSession"
		class="grid h-[90dvh] place-items-center rounded-2xl bg-neutral-900 p-6 text-neutral-100"
	>
		<div class="flex flex-col gap-12">
			<div class="flex flex-col gap-2 text-center">
				<p class="text-neutral-400">You studied for</p>
				<p class="text-4xl font-bold">{Math.floor(duration / 1000 / 60)} minutes</p>
			</div>
			<div class="flex flex-col gap-4">
				<label class="flex flex-col gap-2">
					<p class="text-neutral-400">
						What <span class="text-neutral-100">subject</span> were you studying?
					</p>
					<input
						name="subject"
						required
						class="rounded-md bg-neutral-800 px-4 py-2"
						type="text"
						bind:value={subject}
					/>
				</label>
				<label class="flex flex-col gap-2">
					<p class="text-neutral-400">
						Out of 20, how would you <span class="text-neutral-100">rate your productivity</span>?
					</p>
					<input
						name="rating"
						requireds
						min="1"
						max="20"
						class="rounded-md bg-neutral-800 px-4 py-2"
						type="number"
						bind:value={rating}
					/>
				</label>
				<input type="hidden" name="duration" bind:value={duration} />
				<input
					type="hidden"
					name="date"
					value={new Date().toLocaleDateString('en-AU', {
						weekday: 'short',
						day: '2-digit',
						month: '2-digit',
						year: 'numeric'
					})}
				/>
			</div>
			<button
				type="submit"
				class="flex items-center justify-center gap-2 rounded-md bg-neutral-100 px-4 py-2 font-bold text-neutral-800"
			>
				Save study session
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="size-4"
				>
					<path
						fill-rule="evenodd"
						d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</form>
{/if}

<div>
	<p>
		<span class="text-neutral-400">Days till Methods Exam 1:</span>
		<span>{Math.ceil((new Date(2025, 10, 5) - new Date()) / (1000 * 60 * 60 * 24))}</span>
	</p>
	<p>
		<span class="text-neutral-400">Days till Methods Exam 2:</span>
		<span>{Math.ceil((new Date(2025, 10, 6) - new Date()) / (1000 * 60 * 60 * 24))}</span>
	</p>
</div>

<div class="flex flex-col gap-4">
	<p class="text-xl font-bold">Previous study session</p>
	<div class="overflow-x-auto">
		<div class="min-w-max">
			<div class="grid grid-cols-7 border-b border-neutral-200">
				<p class="col-span-2 px-4 py-2">Date</p>
				<p class="col-span-2 px-4 py-2">Subject</p>
				<p class="px-4 py-2">Duration</p>
				<p class="px-4 py-2">Rating</p>
				<p class="px-4 py-2 text-center">{' '}</p>
			</div>

			{#each sessions as s}
				<div
					class="grid grid-cols-7 items-center divide-x divide-neutral-200 border-b border-neutral-200"
				>
					<p class="col-span-2 px-4 py-2">{s.data.date}</p>
					<p class="col-span-2 px-4 py-2">{s.data.subject}</p>
					<p class="px-4 py-2">{Math.floor(s.data.duration / 1000 / 60) % 60} mins</p>
					<p class="px-4 py-2">{s.data.rating}/20</p>
					<div class="px-4 py-2 text-center">
						<form action="?/deleteSession" method="post">
							<input type="hidden" name="id" value={s.key} />
							<button
								aria-label="delete"
								class="cursor-pointer text-red-500 hover:underline"
								title="Delete session"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
									class="size-4"
								>
									<path
										fill-rule="evenodd"
										d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
										clip-rule="evenodd"
									/>
								</svg></button
							>
						</form>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
