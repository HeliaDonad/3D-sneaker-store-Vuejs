<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Bestellingen en status
const orders = ref([]);
const isAdmin = ref(false); // Bepaalt of de gebruiker admin is

// Laad bestellingen
const loadOrders = async () => {
  const token = localStorage.getItem('token'); // Haal token op
  try {
    const response = await axios.get(
      isAdmin.value
        ? 'https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/'
        : `https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/user`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    orders.value = response.data.data.orders; // Verwerk bestellingen
  } catch (error) {
    console.error('Fout bij ophalen van bestellingen:', error.response?.data?.message || error.message);
  }
};

// Update bestelstatus
const updateOrderStatus = async (orderId, newStatus) => {
  const token = localStorage.getItem('token');
  try {
    await axios.put(
      `https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${orderId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadOrders(); // Bestellingen opnieuw laden
  } catch (error) {
    console.error('Fout bij bijwerken van bestelling:', error.response?.data?.message || error.message);
  }
};

// Verwijder een bestelling
const deleteOrder = async (orderId) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadOrders(); // Bestellingen opnieuw laden
  } catch (error) {
    console.error('Fout bij verwijderen van bestelling:', error.response?.data?.message || error.message);
  }
};

// Bij component mount: controleer adminstatus en laad bestellingen
onMounted(async () => {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(atob(token.split('.')[1])); // Decode token om adminstatus te controleren
  isAdmin.value = userInfo.isAdmin;
  await loadOrders();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">{{ isAdmin ? 'All Orders' : 'My Orders' }}</h1>

    <!-- Geen bestellingen -->
    <div v-if="orders.length === 0" class="text-gray-500">
      No orders found.
    </div>

    <!-- Bestellingen weergeven -->
    <ul v-else class="space-y-4">
      <li
        v-for="order in orders"
        :key="order.id"
        class="border p-4 rounded shadow flex justify-between items-center"
      >
        <div>
          <p><strong>Order ID:</strong> {{ order.id }}</p>
          <p><strong>Status:</strong> {{ order.status }}</p>
          <p v-if="isAdmin"><strong>User:</strong> {{ order.user.name }} ({{ order.user.email }})</p>
        </div>

        <!-- Acties -->
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
