<script setup>
import { ref, onMounted } from 'vue';

const orders = ref([]);

// Functie om de orders vanuit localStorage te laden
const loadOrders = () => {
  orders.value = JSON.parse(localStorage.getItem('orders')) || [];
};

// Functie om de status van een order bij te werken
const updateOrderStatus = (id, newStatus) => {
  const orderIndex = orders.value.findIndex((order) => order.id === id);
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = newStatus;
    localStorage.setItem('orders', JSON.stringify(orders.value));
  }
};

// Functie om een order te verwijderen
const deleteOrder = (id) => {
  orders.value = orders.value.filter((order) => order.id !== id);
  localStorage.setItem('orders', JSON.stringify(orders.value));
};

// Laad de orders bij het laden van de component
onMounted(() => {
  loadOrders();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">All Orders</h1>

    <!-- Controleer of er orders zijn -->
    <div v-if="orders.length === 0" class="text-gray-500">
      No orders found.
    </div>

    <!-- Toon de lijst van orders -->
    <ul v-else class="space-y-4">
      <li
        v-for="order in orders"
        :key="order.id"
        class="border p-4 rounded shadow flex justify-between items-center"
      >
        <div>
          <p><strong>Order ID:</strong> {{ order.id }}</p>
          <p><strong>Status:</strong> {{ order.status }}</p>
          <router-link :to="`/orders/${order.id}`" class="text-blue-500 underline">
            View Details
          </router-link>
        </div>
        <div class="flex space-x-2">
          <button
            @click="updateOrderStatus(order.id, 'Shipped')"
            class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Mark as Shipped
          </button>
          <button
            @click="deleteOrder(order.id)"
            class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Voeg optionele stijlen toe als nodig */
</style>
