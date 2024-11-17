<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const order = ref(null);
const notificationMessage = ref('');
const showNotification = ref(false);

const fetchOrder = async () => {
  try {
    const response = await fetch(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      order.value = data.data; // Pas dit aan afhankelijk van de API-respons
    } else {
      throw new Error('Kan bestelling niet ophalen.');
    }
  } catch (error) {
    notificationMessage.value = error.message;
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 3000);
  }
};

onMounted(fetchOrder);
</script>

<template>
  <div>
    <h1>Bestelling Details</h1>
    <div v-if="!order">Laden...</div>
    <div v-else>
      <p>Bestelling ID: {{ order.id }}</p>
      <p>Status: {{ order.status }}</p>
      <ul>
        <li v-for="item in order.items" :key="item.id">
          Maat: {{ item.size }}, Kleur: {{ item.color }}, Hoeveelheid: {{ item.quantity }}
        </li>
      </ul>
    </div>

    <!-- Notificatie -->
    <div v-if="showNotification" class="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2">
      {{ notificationMessage }}
    </div>
  </div>
</template>
