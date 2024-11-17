<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const totalOrders = ref(0);

// Haal bestellingen op bij component mount
const fetchOrders = async () => {
  try {
    const response = await axios.get('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders');
    orders.value = response.data.data;
    totalOrders.value = orders.value.length;
  } catch (error) {
    console.error('Fout bij ophalen van bestellingen:', error);
  }
};

// Verwijder een bestelling
const deleteOrder = async (id) => {
  try {
    await axios.delete(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${id}`);
    orders.value = orders.value.filter(order => order.id !== id);
    totalOrders.value--;
  } catch (error) {
    console.error('Fout bij verwijderen van bestelling:', error);
  }
};

onMounted(fetchOrders);
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-4">Bestellingen ({{ totalOrders }})</h1>
    <ul>
      <li v-for="order in orders" :key="order.id" class="mb-4 border p-4 rounded">
        <p><strong>Order ID:</strong> {{ order.id }}</p>
        <p><strong>Status:</strong> {{ order.status }}</p>
        <p><strong>Klant:</strong> {{ order.customer }}</p>
        <button @click="deleteOrder(order.id)" class="text-red-500 hover:underline">
          Verwijder
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Simpele stijl met TailwindCSS */
</style>
