<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const errorMessage = ref('');

// Functie om orders vanuit localStorage te laden
const loadOrders = async () => {
  try {
    const response = await axios.get('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders');
    orders.value = response.data;
  } catch (error) {
    console.error('Error loading orders:', error);
    errorMessage.value = 'Failed to load orders. Please try again later.';
  }
};

// Functie om de status van een bestelling te updaten
const updateOrderStatus = async (id, newStatus) => {
  try {
    const response = await axios.patch(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${id}`, {
      status: newStatus,
    });
    // Update lokaal de orderstatus
    const orderIndex = orders.value.findIndex((order) => order.id === id);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = response.data.status;
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    errorMessage.value = 'Failed to update order status. Please try again.';
  }
};
// Functie om een bestelling te verwijderen
const deleteOrder = async (id) => {
  try {
    await axios.delete(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${id}`);
    // Verwijder lokaal de order
    orders.value = orders.value.filter((order) => order.id !== id);
  } catch (error) {
    console.error('Error deleting order:', error);
    errorMessage.value = 'Failed to delete order. Please try again.';
  }
};

// Laad orders bij het mounten van de component
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
