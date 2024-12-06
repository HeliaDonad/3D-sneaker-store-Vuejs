<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]); // Lijst van orders
const error = ref(''); // Eventuele foutmeldingen

// Functie om orders van de back-end op te halen
const fetchOrders = async () => {
  const token = localStorage.getItem('token'); // Haal het token op uit localStorage

  try {
    const response = await axios.get('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders', {
      headers: {
        Authorization: `Bearer ${token}`, // Voeg het token toe aan de header
      },
    });
    orders.value = response.data.data; // Wijs de ontvangen data toe
  } catch (err) {
    console.error('Error fetching orders:', err);
    error.value = 'Failed to fetch orders. Please try again later.';
  }
};

// Functie om de status van een bestelling te updaten
const updateOrderStatus = async (orderId, newStatus) => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.patch(
      `https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${orderId}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.status === 'success') {
      // Werk de status lokaal bij
      const orderIndex = orders.value.findIndex(order => order._id === orderId);
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = newStatus;
      }
      alert('Order status updated successfully!');
    } else {
      alert('Failed to update order status.');
    }
  } catch (err) {
    console.error('Error updating order status:', err);
    alert('Failed to update order status.');
  }
};

// Functie om een bestelling te verwijderen
const deleteOrder = async (orderId) => {
  const token = localStorage.getItem('token'); // Haal het token op uit localStorage

  try {
    const response = await axios.delete(
      `https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Voeg token toe aan de header
        },
      }
    );

    if (response.data.status === 'success') {
      // Verwijder de order lokaal
      orders.value = orders.value.filter(order => order._id !== orderId);
      alert('Order deleted successfully!');
    } else {
      alert(`Failed to delete order: ${response.data.message}`);
    }
  } catch (err) {
    console.error('Error deleting order:', err);
    alert('Failed to delete order. Please try again.');
  }
};

// Haal orders op bij het laden van de component
onMounted(fetchOrders);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">All Orders</h1>

    <!-- Foutmelding -->
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

    <!-- Geen orders gevonden -->
    <div v-if="orders.length === 0 && !error" class="text-gray-500">
      No orders found.
    </div>

    <!-- Toon alle orders -->
    <ul v-else class="space-y-4">
      <li
        v-for="order in orders"
        :key="order._id"
        class="border p-4 rounded shadow flex flex-col space-y-4"
      >
        <div>
          <p><strong>Order ID:</strong> {{ order._id }}</p>
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
        </div>

        <!-- Toon contactinformatie -->
        <div>
          <h3 class="text-lg font-semibold">Contact Info</h3>
          <p><strong>Name:</strong> {{ order.contactInfo?.name }}</p>
          <p><strong>Email:</strong> {{ order.contactInfo?.email }}</p>
          <p><strong>Phone:</strong> {{ order.contactInfo?.phone }}</p>
        </div>

        <!-- Toon items -->
        <div>
          <h3 class="text-lg font-semibold">Items</h3>
          <ul>
            <li v-for="item in order.items" :key="item.productId" class="flex justify-between">
              <span>Product ID: {{ item.productId }}</span>
              <span>Size: {{ item.size }}</span>
              <span>Quantity: {{ item.quantity }}</span>
            </li>
          </ul>
        </div>

        <!-- Status update en delete knoppen -->
        <div class="flex space-x-2">
          <button
            v-if="order.status === 'Pending'"
            @click="updateOrderStatus(order._id, 'In Production')"
            class="bg-blue-500 text-white px-2 py-1 rounded"
          >
            In Production
          </button>
          <button
            v-if="order.status === 'In Production'"
            @click="updateOrderStatus(order._id, 'Shipped')"
            class="bg-green-500 text-white px-2 py-1 rounded"
          >
            Shipped
          </button>
          <button
            @click="deleteOrder(order._id)"
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
