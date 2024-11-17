<script setup>
import { ref, onMounted } from 'vue';

const orders = ref([]);
const isLoggedIn = ref(false);
const notificationMessage = ref('');
const showNotification = ref(false);

const fetchOrders = async () => {
  try {
    const response = await fetch('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      orders.value = data.data; // Pas dit aan afhankelijk van de API-respons
    } else {
      throw new Error('Kan bestellingen niet ophalen.');
    }
  } catch (error) {
    notificationMessage.value = error.message;
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 3000);
  }
};

// Controleer loginstatus
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
};

onMounted(() => {
  checkLoginStatus();
  if (isLoggedIn.value) fetchOrders();
});
</script>

<template>
  <div>
    <h1>Mijn Bestellingen</h1>
    <div v-if="orders.length === 0">Je hebt nog geen bestellingen geplaatst.</div>
    <ul>
      <li v-for="order in orders" :key="order.id">
        <router-link :to="'/orders/' + order.id">Bestelling #{{ order.id }}</router-link>
      </li>
    </ul>

    <!-- Notificatie -->
    <div v-if="showNotification" class="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2">
      {{ notificationMessage }}
    </div>
  </div>
</template>
