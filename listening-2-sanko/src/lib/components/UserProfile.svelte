<script lang="ts">
    import { userData } from "$lib/stores/userDataStore";

    function updateUsername(newUsername: string) {
        userData.update({ username: newUsername });
    }
</script>

{#if $userData}
    <h1>Welcome, {$userData.username}!</h1>
    <p>Email: {$userData.email}</p>
    <input
        type="text"
        value={$userData.username}
        on:input={(e) => updateUsername(e.target.value)}
    />
{:else}
    <p>Loading user data...</p>
{/if}
