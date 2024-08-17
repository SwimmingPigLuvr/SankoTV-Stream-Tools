<script lang="ts">
    import { showLinkVisualMedia } from "$lib/stores";
    import { createEventDispatcher } from "svelte";

    export let type: "audio" | "visual";
    export let mode: "link" | "upload";

    let media: string | null = null;
    let error: string = "";

    const soundLibrary = ["club_beat", "notification", "pop"];

    const dispatch = createEventDispatcher();

    function handleClose() {
        showLinkVisualMedia.set(false);
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
        }
    }

    function handleLinkChange(event: Event) {
        const target = event.target as HTMLInputElement;
        media = target.value;
        error = "";
        dispatch("mediaSelected", { media });
    }

    function handleSubmit() {
        if (media) {
            dispatch("submit", { media });
        } else {
            error = "Please select or link media before submitting.";
        }
    }
</script>

<button
    on:click|self={handleClose}
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
>
    <button
        on:click|stopPropagation
        class="bg-white p-8 rounded-lg shadow-xl w-96"
    >
        <h2 class="text-2xl font-bold mb-4">
            {type === "audio" ? "Audio" : "Visual"} Media {mode === "link"
                ? "Link"
                : "Upload"}
        </h2>

        {#if mode === "upload"}
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
        {:else}
            <div class="mb-4">
                <label
                    class="text-left block text-gray-700 text-sm font-bold mb-2"
                    for="media-link"
                >
                    Enter a link:
                </label>
                <input
                    type="text"
                    id="media-link"
                    on:input={handleLinkChange}
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="paste url here"
                />
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

        {#if media}
            <div class="mt-4">
                <h3 class="text-lg font-semibold mb-2">Preview:</h3>
                {#if type === "audio"}
                    <audio controls src={media} class="w-full" />
                {:else}
                    <img
                        src={media}
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
