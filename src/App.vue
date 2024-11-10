<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

// Reactive state to check login status
const isLoggedIn = ref(false);

// Check for a valid token on component mount to set initial login status
onMounted(() => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
  if (!isLoggedIn.value) {
    router.push('/login'); // Redirect to login if not authenticated
  }
});

// Logout function to reset login status and redirect to login page
const logout = () => {
  isLoggedIn.value = false;
  localStorage.removeItem('token'); // Remove token from storage
  router.push('/login'); // Redirect to login
};

// Quantity controls for product customization
const quantity = ref(1);

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};
</script>

<template>
      <router-view></router-view>
</template>

<style scoped>
/* Voeg TailwindCSS klassen toe voor styling */
button {
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #3b3b3b; /* Darker gray */
}
</style>