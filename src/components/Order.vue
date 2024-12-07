<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const order = ref(null);
const error = ref('');

// Haal orderdetails op
const fetchOrderDetails = async (orderId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(
      `https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Zorg dat het token wordt meegegeven
        },
      }
    );

    order.value = response.data.data;
  } catch (err) {
    console.error('Error fetching order details:', err);
    error.value = 'Failed to fetch order details. Please try again later.';
  }
};

// Bij component mount
onMounted(() => {
  fetchOrderDetails(route.params.id);
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Order Details</h1>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

    <div v-if="order" class="space-y-4">
      <div>
        <p><strong>Order ID:</strong> {{ order._id }}</p>
      </div>
      <div>
        <h3 class="text-lg font-semibold">Contact Info</h3>
        <p><strong>Name:</strong> {{ order.contactInfo?.name }}</p>
        <p><strong>Email:</strong> {{ order.contactInfo?.email }}</p>
      </div>
      <div>
        <h3 class="text-lg font-semibold">Items</h3>
        <ul>
          <li v-for="item in order.items" :key="item.productId">
            <p><strong>Product ID:</strong> {{ item.productId }}</p>
            <p><strong>Size:</strong> {{ item.size }}</p>
            <p><strong>Quantity:</strong> {{ item.quantity }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
