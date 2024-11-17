<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Logout-functie
const logout = () => {
  localStorage.removeItem('token'); // Verwijder het token
  router.push('/login'); // Redirect naar de loginpagina
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-lg font-medium mb-4">Account</h1>

    <!-- Links -->
    <ul class="space-y-2">
      <li>
        <a
          @click.prevent="() => router.push('/change-password')"
          href="#"
          class="hover:underline cursor-pointer"
        >
          Change Password
        </a>
      </li>
      <li>
        <a
          @click.prevent="logout"
          href="#"
          class="hover:underline cursor-pointer"
        >
          Logout
        </a>
      </li>
      <li>
        <a
          @click.prevent="() => router.push('/orders')"
          href="#"
          class="hover:underline cursor-pointer"
        >
          Orders
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* TailwindCSS zorgt voor eenvoudige styling. Pas hier alleen aan als nodig. */
</style>
