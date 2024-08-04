<script lang="ts">
    import { userData } from "$lib/stores/userDataStore";

    function updateUsername(newUsername: string) {
        userData.updateUserData({ username: newUsername });
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        updateUsername(target.value);
    }
</script>

{#if $userData}
    <h1>Welcome, {$userData.username}!</h1>
    <p>Email: {$userData.email}</p>
    <input type="text" value={$userData.username} on:input={handleInput} />
{:else}
    <p>Loading user data...</p>
{/if}
