<script lang="ts">
    import {
        images,
        gifs,
        videos,
        sounds,
        type MediaItem,
    } from "$lib/media-options";
    import {
        isDarkMode,
        showLinkVisualMedia,
        showSelectVisualMedia,
    } from "$lib/stores";
    import { currentAlert } from "$lib/stores/alertConfigStore";
    import { createEventDispatcher } from "svelte";
    import { blur, fade, slide } from "svelte/transition";

    export let type: "audio" | "visual";
    export let mode: "link" | "upload" | "select";

    let media: string | null = null;
    let error: string = "";
    let previewVideo: MediaItem | null = null;

    const dispatch = createEventDispatcher();

    function handleClose() {
        showLinkVisualMedia.set(false);
        showSelectVisualMedia.set(false);
    }

    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            if (type === "audio" && !file.type.startsWith("audio/")) {
                error = "Please upload an audio file.";
                return;
            }
            if (type === "visual" && !file.type.startsWith("image/")) {
                error = "Please upload an image file.";
                return;
            }
            media = URL.createObjectURL(file);
            error = "";
            dispatch("mediaSelected", { media, file });
            handleClose();
        }
    }

    function handleLinkChange(event: Event) {
        const target = event.target as HTMLInputElement;
        media = target.value;
        error = "";
        dispatch("mediaSelected", { media });
        handleClose();
    }

    function handleSelect(item: MediaItem) {
        media = item.src;
        error = "";
        dispatch("mediaSelected", { media: item.src });
        handleClose();
    }

    function handleVideoSelect(video: MediaItem) {
        previewVideo = video;
    }

    function closePreview() {
        previewVideo = null;
    }

    function handleSubmit() {
        if (media) {
            dispatch("submit", { media });
            handleClose();
        } else {
            error = "Please select or link media before submitting.";
        }
    }
</script>

<button
    in:fade={{ duration: 300 }}
    on:click|self={handleClose}
    class="fixed inset-0 {$isDarkMode
        ? 'bg-black'
        : 'bg-white'} bg-opacity-50 backdrop-blur-xl flex items-center justify-center overflow-y-auto"
>
    <!-- modal -->
    <button
        in:slide={{ delay: 300 }}
        on:click|stopPropagation
        class="{$isDarkMode
            ? 'border-lime-400 bg-black '
            : 'border-blue-700 bg-white'} rounded-none border-[2px] p-8 shadow-xl {mode ===
        'link'
            ? 'w-96'
            : 'w-[555px]'} max-h-[800px] flex flex-col"
    >
        {#if previewVideo}
            <div class="w-full h-full flex flex-col">
                <video
                    src={previewVideo.src}
                    controls
                    autoplay
                    class="w-full h-auto"
                />
                <div class="flex space-x-4 text-xl justify-end">
                    <button
                        on:click={closePreview}
                        class="mt-4 bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
                        >go back</button
                    >
                    <button
                        on:click={() =>
                            previewVideo && handleSelect(previewVideo)}
                        class="mt-4 bg-lime-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
                        >use video</button
                    >
                </div>
            </div>
        {:else if mode === "upload"}
            <div class="mb-4">
                <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="file-upload"
                >
                    Choose a file:
                </label>
                <input
                    type="file"
                    id="file-upload"
                    accept={type === "audio" ? "audio/*" : "image/*"}
                    on:change={handleFileChange}
                    class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>
        {:else if mode === "link"}
            <div class="mb-4 w-full">
                <label
                    class="text-left block text-sm font-bold mb-2"
                    for="media-link"
                >
                    Paste URL:
                </label>
                <input
                    type="text"
                    id="media-link"
                    on:input={handleLinkChange}
                    class="{$isDarkMode
                        ? 'bg-black'
                        : ''} shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={$currentAlert?.config.mediaSrc
                        ? $currentAlert?.config.mediaSrc
                        : "paste url here"}
                />
            </div>
        {:else}
            <!-- Create a container for the grid -->
            <div class="mb-4">
                <label
                    class="text-left block text-sm font-bold mb-2"
                    for="media-option"
                >
                    Choose Media:
                </label>
            </div>

            <!-- Grid container for images -->
            <div class="image-grid overflow-x-hidden overflow-y-auto">
                <!-- Example images (replace with dynamic content as needed) -->
                {#each gifs as gif}
                    <button on:click={() => handleSelect(gif)}>
                        <img src={gif.src} alt="" class="image-item" />
                    </button>
                {/each}
                {#each images as image}
                    <button on:click={() => handleSelect(image)}>
                        <img src={image.src} alt="" class="image-item" />
                    </button>
                {/each}
                {#each videos as video}
                    <button
                        on:click={() => handleVideoSelect(video)}
                        class="relative image-item"
                    >
                        <video src={video.src} class="image-item" />
                        <div
                            class="absolute text-5xl inset-0 flex items-center justify-center hover:bg-opacity-10 bg-black bg-opacity-50"
                        >
                            ▶️
                        </div>
                    </button>
                {/each}
            </div>
        {/if}

        {#if error}
            <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
            >
                <span class="block sm:inline">{error}</span>
            </div>
        {/if}

        {#if media || $currentAlert?.config.mediaSrc}
            <div class="mt-4">
                {#if type === "audio"}
                    <audio controls src={media} class="w-full" />
                {:else if mode !== "select"}
                    <img
                        src={$currentAlert?.config.mediaSrc
                            ? $currentAlert?.config.mediaSrc
                            : media}
                        alt="Uploaded visual"
                        class="w-full h-auto"
                    />
                {/if}
            </div>
        {/if}

        {#if mode !== "link" && type !== "visual"}
            <div class="mt-6 flex justify-end">
                <button
                    on:click={handleSubmit}
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {mode === "upload" ? "Upload" : "Add Link"}
                </button>
            </div>
        {/if}
    </button>
</button>

<style>
    /* Style for the grid container */
    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
    }

    /* Style for individual grid items */
    .image-item {
        width: auto;
        height: 100%;
        object-fit: contain;
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    /* Add a hover effect to the images */
    .image-item:hover {
        transform: scale(1.05);
    }
</style>
