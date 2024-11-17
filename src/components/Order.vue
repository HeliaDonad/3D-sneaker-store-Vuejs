<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const orderId = route.params.id;

const orders = ref([]);
const orderDetails = ref(null);

// Laad orders uit localStorage
const loadOrders = () => {
  const storedOrders = localStorage.getItem('orders');
  orders.value = storedOrders ? JSON.parse(storedOrders) : [];
  orderDetails.value = orders.value[orderId - 1] || null; // Zoek orderdetails op basis van ID
};

// Initialiseer orders bij component mount
loadOrders();
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Order Details</h1>
    <div v-if="!orderDetails" class="text-gray-500">
      Order not found.
    </div>
    <div v-else>
      <p><strong>Order ID:</strong> {{ orderId }}</p>
      <p><strong>Items:</strong></p>
      <ul>
        <li
          v-for="(item, i) in orderDetails.items"
          :key="i"
        >
          Size: {{ item.size }}, Color: {{ item.color }}, Quantity: {{ item.quantity }}
        </li>
      </ul>
      <p><strong>Status:</strong> {{ orderDetails.status }}</p>
    </div>
  </div>
</template>
