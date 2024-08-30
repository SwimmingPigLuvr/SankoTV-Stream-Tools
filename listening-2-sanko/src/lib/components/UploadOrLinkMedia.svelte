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
        selectionMode,
        selectionType,
        showSelectMedia,
    } from "$lib/stores";
    import { currentAlert } from "$lib/stores/alertConfigStore";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { blur, fade, slide } from "svelte/transition";

    let media: MediaItem | null = null;
    let error: string = "";
    let audioElement: HTMLAudioElement;
    let selectedSound: MediaItem | null = null;
    let previewVideo: MediaItem | null = null;

    const dispatch = createEventDispatcher();

    function getFileType(file: File): "image" | "video" | "audio" | "gif" {
        const fileName = file.name.toLowerCase();
        const extension = fileName.split(".").pop();

        if (extension) {
            if (["jpg", "jpeg", "png", "webp"].includes(extension))
                return "image";
            if (extension === "gif") return "gif";
            if (["mp4", "webm", "avi", "mov"].includes(extension))
                return "video";
            if (["mp3", "wav", "ogg"].includes(extension)) return "audio";
        }

        throw new Error("unsupported file type");
    }

    // Function to extract the name of the file from a given path or URL
    function getFileName(mediaItem: MediaItem): string {
        const parts = mediaItem.src.split("/");
        const fileNameWithExtension = parts[parts.length - 1];
        const fileName = fileNameWithExtension.split(".")[0];
        return fileName;
    }

    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            try {
                const fileType = getFileType(file);
                if ($selectionType === "audio" && fileType !== "audio") {
                    error = "Please upload an audio file.";
                    return;
                }
                if (
                    $selectionType === "visual" &&
                    !["image", "gif", "video"].includes(fileType)
                ) {
                    error = "Please upload an image or video file.";
                    return;
                }

                const mediaItem: MediaItem = {
                    src: URL.createObjectURL(file),
                    type: fileType,
                    category: "uploaded", // You might want to prompt the user for a more specific category
                };

                media = mediaItem;
                error = "";
                if ($selectionType === "audio") {
                    dispatch("audioSelected", { media: mediaItem, file });
                } else {
                    dispatch("mediaSelected", { media: mediaItem, file });
                }
                handleClose();
            } catch (e) {
                error = "Unsupported file type.";
            }
        }
    }

    function handleClose() {
        showSelectMedia.set(false);
    }

    function getLinkType(url: string): "image" | "video" | "audio" | "gif" {
        const extension = url.split(".").pop()?.toLowerCase();
        if (extension) {
            if (["jpg", "jpeg", "png", "webp"].includes(extension))
                return "image";
            if (extension === "gif") return "gif";
            if (["mp4", "webm"].includes(extension)) return "video";
            if (["mp3", "wav", "ogg"].includes(extension)) return "audio";
        }
        return "image"; // default
    }

    function handleLinkChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const url = target.value;
        const mediaItem: MediaItem = {
            src: url,
            type: getLinkType(url),
            category: "link",
        };

        media = mediaItem;
        error = "";
        if ($selectionType === "audio") {
            dispatch("audioSelected", { media: mediaItem });
        } else {
            dispatch("mediaSelected", { media: mediaItem });
        }
        handleClose();
    }

    function handleSelect(item: MediaItem) {
        media = item;
        error = "";
        dispatch("mediaSelected", { media: item });
        handleClose();
    }

    function handleSoundSelect(sound: MediaItem): void {
        // Stop any currently playing audio
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }

        // Update the selected sound
        selectedSound = sound;

        // Play the new audio
        if (audioElement) {
            audioElement.src = sound.src;
            audioElement
                .play()
                .then(() => {
                    console.log("Audio started playing");
                    // Dispatch the event after successfully starting playback
                    dispatch("audioSelected", { media: selectedSound });
                })
                .catch((error) => {
                    console.error("Error playing audio", error);
                    // You might still want to dispatch the event even if playback fails
                    dispatch("audioSelected", { media: selectedSound });
                });
        } else {
            console.error("Audio element not found");
            // Dispatch the event even if the audio element is not available
            dispatch("audioSelected", { media: selectedSound });
        }
    }

    function preloadAudio(sound: MediaItem): void {
        if (sound.type === "audio") {
            const audio = new Audio();
            audio.preload = "auto";
            audio.src = sound.src;
        }
    }

    function addAudioEventListeners() {
        if (audioElement) {
            audioElement.addEventListener("play", () =>
                console.log("Audio play event fired"),
            );
            audioElement.addEventListener("playing", () =>
                console.log("Audio playing event fired"),
            );
            audioElement.addEventListener("pause", () =>
                console.log("Audio pause event fired"),
            );
            audioElement.addEventListener("ended", () =>
                console.log("Audio ended event fired"),
            );
            audioElement.addEventListener("error", (e) =>
                console.error("Audio error:", e),
            );
        }
    }

    function checkAudioDuration(sound: MediaItem): Promise<number> {
        return new Promise((resolve) => {
            const audio = new Audio(sound.src);
            audio.addEventListener("loadedmetadata", () => {
                console.log(`Audio duration: ${audio.duration} seconds`);
                resolve(audio.duration);
            });
            audio.addEventListener("errro", (e) => {
                console.error("error loading audio:", e);
                resolve(0);
            });
        });
    }

    function playAudio(sound: MediaItem): void {
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }

        audioElement.src = sound.src;

        const timeUpdateListener = () => {
            console.log(`current time: ${audioElement.currentTime}`);
        };
        audioElement.addEventListener("timeupdate", timeUpdateListener);

        audioElement
            .play()
            .then(() => {
                console.log("audio playback started successfully");
            })
            .catch((error) => {
                console.error("error playing audio: ", error);
            });

        audioElement.addEventListener(
            "ended",
            () => {
                audioElement.removeEventListener(
                    "timeupdate",
                    timeUpdateListener,
                );
            },
            { once: true },
        );
    }

    function checkAudioFileLoading(sound: MediaItem) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () =>
                resolve("Audio file loaded successfully");
            audio.onerror = () => reject("Error loading audio file");
            audio.src = sound.src;
        });
    }

    function logAudioElementProperties() {
        if (audioElement) {
            console.log("Audio element properties:");
            console.log("- src:", audioElement.src);
            console.log("- muted:", audioElement.muted);
            console.log("- volume:", audioElement.volume);
            console.log("- paused:", audioElement.paused);
        } else {
            console.log("Audio element not found");
        }
    }

    onMount(async () => {
        addAudioEventListeners();
        logAudioElementProperties();

        sounds.forEach((sound) => {
            checkAudioFileLoading(sound)
                .then((message) => console.log(message))
                .catch((error) => console.error(error));
        });
        for (const sound of sounds) {
            if (sound.type === "audio") {
                const duration = await checkAudioDuration(sound);
                console.log(`Duration of ${sound.src}: ${duration} seconds`);
            }
        }
    });

    function handleVideoSelect(video: MediaItem) {
        previewVideo = video;
    }

    function closeVideoPreview() {
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

<!-- BG BEHIND MODAL -->
<button
    in:fade={{ duration: 300 }}
    on:click|self={handleClose}
    class="fixed inset-0 {$isDarkMode
        ? 'bg-black'
        : 'bg-white'} bg-opacity-50 backdrop-blur-xl flex items-center justify-center overflow-y-auto"
>
    <!-- MODAL -->
    <!-- i want this to have a smooth transition -->
    <button
        in:slide={{ delay: 300 }}
        on:click|stopPropagation
        class="{$isDarkMode
            ? 'border-lime-400 bg-black '
            : 'border-blue-700 bg-white'} relative rounded-none border-[1px] p-8 shadow-xl w-[555px] max-h-[800px] flex flex-col transition-all duration-1000 ease-out cursor-auto"
    >
        <!-- UPLOAD / LINK / SELECT TABS -->
        <div
            class="{$isDarkMode
                ? 'border-lime-400'
                : 'border-blue-700'} font-black flex mb-4 absolute -top-12 left-0 border-[1px] border-black"
        >
            <button
                class="{$selectionMode === 'upload'
                    ? $isDarkMode
                        ? 'bg-lime-400 text-black'
                        : 'bg-blue-700 text-white'
                    : $isDarkMode
                      ? 'bg-black text-white hover:text-lime-400'
                      : 'bg-white text-black hover:text-blue-700'} px-4 py-2"
                on:click={() => {
                    selectionMode.set("upload");
                    previewVideo = null;
                    selectedSound = null;
                }}
            >
                Upload
            </button>
            <button
                class="{$selectionMode === 'link'
                    ? $isDarkMode
                        ? 'bg-lime-400 text-black'
                        : 'bg-blue-700 text-white'
                    : $isDarkMode
                      ? 'bg-black text-white hover:text-lime-400'
                      : 'bg-white text-black hover:text-blue-700'} px-4 py-2"
                on:click={() => {
                    selectionMode.set("link");
                    previewVideo = null;
                    selectedSound = null;
                }}
            >
                Link
            </button>
            <button
                class="{$selectionMode === 'select'
                    ? $isDarkMode
                        ? 'bg-lime-400 text-black'
                        : 'bg-blue-700 text-white'
                    : $isDarkMode
                      ? 'bg-black text-white hover:text-lime-400'
                      : 'bg-white text-black hover:text-blue-700'} px-4 py-2"
                on:click={() => selectionMode.set("select")}
            >
                Select
            </button>
        </div>

        <!-- PREVIEW VIDEO BEFORE SELECTING -->
        {#if previewVideo}
            <div class="w-full h-full flex flex-col">
                <video
                    src={previewVideo.src}
                    controls
                    autoplay
                    class="w-full h-auto max-h-[650px]"
                >
                    <track kind="captions" src="" label="English" />
                </video>

                <div class="flex space-x-4 text-xl justify-end">
                    <!-- GO BACK -->
                    <button
                        on:click={closeVideoPreview}
                        class="mt-4 bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
                        >go back</button
                    >

                    <!-- SELECT VIDEO -->
                    <button
                        on:click={() =>
                            previewVideo && handleSelect(previewVideo)}
                        class="mt-4 bg-lime-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
                        >use video</button
                    >
                </div>
            </div>
        {:else if $selectionMode === "select" && $selectionType === "audio"}
            <div class="w-full h-full flex flex-col">
                <div class="audio-grid p-2 overflow-x-hidden overflow-y-auto">
                    {#each sounds as sound}
                        <button
                            on:click={() => handleSoundSelect(sound)}
                            class="{sound ===
                            $currentAlert?.config?.notificationSound
                                ? 'text-fuchsia-600'
                                : ''} relative audio-item -tracking-widest p-2 hover:text-lime-400"
                            >{getFileName(sound)}</button
                        >
                    {/each}
                </div>
            </div>
        {:else if $selectionMode === "upload"}
            <!-- UPLOAD MEDIA -->
            <div class="mb-4">
                <label
                    class="block text-left text-gray-700 text-sm font-bold mb-2"
                    for="file-upload"
                >
                    Choose a file:
                </label>
                <input
                    type="file"
                    id="file-upload"
                    accept={$selectionType === "audio"
                        ? "audio/*"
                        : "image/*,video/*"}
                    on:change={handleFileChange}
                    class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>
        {:else if $selectionMode === "link"}
            <!-- LINK MEDIA -->
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
                    placeholder="Paste URL Here"
                />
            </div>
        {:else if $selectionMode === "select"}
            <!-- SELECT MEDIA -->
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
                <!-- TODO -->
                <!-- add section for user's uploads -->
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
                        <video src={video.src} class="image-item"
                            ><track
                                src=""
                                kind="captions"
                                label="English"
                            /></video
                        >
                        <div
                            class="absolute text-white text-5xl inset-0 flex items-center justify-center hover:bg-opacity-10 {$isDarkMode
                                ? 'bg-black'
                                : 'bg-white'} bg-opacity-50"
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

        {#if media || $currentAlert?.config?.media}
            <div class="mt-4 w-full">
                {#if $selectionType === "audio"}
                    <audio
                        bind:this={audioElement}
                        autoplay
                        controls
                        src={selectedSound?.src}
                        on:ended={() => {
                            console.log("Audio playback ended");
                        }}
                        class="bg-blue-700 rounded-none p-2 w-full"
                    />
                {:else if $selectionMode !== "select"}
                    <!-- SHOW SELECTED MEDIA -->
                    <div class="flex items-center justify-center w-full p-8">
                        {#if $currentAlert?.config?.media?.type === "video"}
                            <video
                                autoplay
                                muted
                                loop
                                class="w-full max-w-full max-h-full"
                                src={$currentAlert?.config?.media?.src}
                                ><track
                                    kind="captions"
                                    src=""
                                    label="English"
                                /></video
                            >
                        {:else}
                            <img
                                src={$currentAlert?.config?.media?.src ??
                                    (media && "src" in media
                                        ? media.src
                                        : null)}
                                alt="Uploaded visual"
                                class="max-w-full max-h-full object-contain"
                            />
                        {/if}
                    </div>
                {/if}
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
        object-fit: cover;
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .audio-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15;
    }

    /* Add a hover effect to the images */
    .audio-item:hover {
        transform: scale(1.15);
    }
</style>
