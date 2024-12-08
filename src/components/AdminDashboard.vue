<script setup>
import Orders from './Orders.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false); // Loginstatus controleren

// Loginstatus ophalen
const checkLoginStatus = () => {
  const token = localStorage.getItem('token'); // Controleer of er een token aanwezig is
  isLoggedIn.value = !!token; // Zet isLoggedIn op true als er een token is
};

onMounted(() => {
  checkLoginStatus(); // Controleer loginstatus bij component mount
});
</script>

<template>
    <header class="bg-gray-500 text-white p-4 flex justify-between items-center">
      <img src="../assets/images/SWEAR_Logo_black.avif" alt="" class="headerLogo">
      <nav>
        <ul class="flex space-x-4">
          <li>
            <button
              v-if="!isLoggedIn"
              @click="() => router.push('/login')"
              class="hover:underline"
            >
              ACCOUNT
            </button>
            <div v-else>
              <button @click="() => router.push('/account')" class="hover:underline">
                ACCOUNT
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  <div>
    <h1 class="text-3xl font-bold mb-6" style="margin-top: 1.5rem; margin-left: 1.5rem;">Admin Dashboard</h1>
    <Orders />
  </div>
</template>

<style scoped>

header {
  background-color: #64f243;
  color: #000000;
  font-family: Helvetica;
  font-weight: bold;
  height: 60px;
}
.headerLogo {
  height: 25px;
}

</style>