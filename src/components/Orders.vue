<script setup>
import { ref, onMounted } from 'vue';

const orders = ref([]);

// Functie om orders vanuit localStorage te laden
const loadOrders = () => {
  orders.value = JSON.parse(localStorage.getItem('orders')) || [];
};

// Functie om de status van een bestelling te updaten
const updateOrderStatus = (id, newStatus) => {
  const orderIndex = orders.value.findIndex((order) => order.id === id);
  if (orderIndex !== -1) {
    orders.value[orderIndex].status = newStatus;
    localStorage.setItem('orders', JSON.stringify(orders.value));
  }
};

// Functie om een bestelling te verwijderen
const deleteOrder = (id) => {
  orders.value = orders.value.filter((order) => order.id !== id);
  localStorage.setItem('orders', JSON.stringify(orders.value));
};

// Bij component mount orders laden
onMounted(() => {
  loadOrders();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">All Orders</h1>

    <!-- Geen orders gevonden -->
    <div v-if="orders.length === 0" class="text-gray-500">
      No orders found.
    </div>

    <!-- Toon alle orders -->
    <ul v-else class="space-y-4">
      <li
        v-for="order in orders"
        :key="order.id"
        class="border p-4 rounded shadow flex justify-between items-center"
      >
        <div>
          <p><strong>Order ID:</strong> {{ order.id }}</p>
          <p>
            <strong>Status: </strong>
            <span
              :class="{
                'text-yellow-500': order.status === 'Pending',
                'text-blue-500': order.status === 'In Production',
                'text-green-500': order.status === 'Shipped'
              }"
            >
              {{ order.status }}
            </span>
          </p>
          <router-link :to="`/orders/${order.id}`" class="text-blue-500 underline">
            View Details
          </router-link>
        </div>

        <!-- Status update knoppen -->
        <div class="flex space-x-2">
          <button
            v-if="order.status === 'Pending'"
            @click="updateOrderStatus(order.id, 'In Production')"
            class="bg-blue-500 text-white px-2 py-1 rounded"
          >
            In Production
          </button>
          <button
            v-if="order.status === 'In Production'"
            @click="updateOrderStatus(order.id, 'Shipped')"
            class="bg-green-500 text-white px-2 py-1 rounded"
          >
            Shipped
          </button>
          <button
            @click="deleteOrder(order.id)"
            class="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Basisstijl voor knoppen */
button {
  font-weight: bold;
}

.text-yellow-500 {
  color: #facc15;
}
.text-blue-500 {
  color: #3b82f6;
}
.text-green-500 {
  color: #22c55e;
}
</style>