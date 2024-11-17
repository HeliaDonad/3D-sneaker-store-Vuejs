<script setup>
import { ref } from 'vue';

// Haal bestellingen op uit localStorage
const orders = ref([]);

const loadOrders = () => {
  const storedOrders = localStorage.getItem('orders');
  orders.value = storedOrders ? JSON.parse(storedOrders) : [];
};

// Laad bestellingen bij component mount
loadOrders();
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Orders</h1>
    <div v-if="orders.length === 0" class="text-gray-500">
      No orders found.
    </div>
    <ul v-else class="space-y-4">
      <li
        v-for="(order, index) in orders"
        :key="index"
        class="border p-4 rounded shadow"
      >
        <p><strong>Order ID:</strong> {{ index + 1 }}</p>
        <p><strong>Items:</strong></p>
        <ul>
          <li
            v-for="(item, i) in order.items"
            :key="i"
          >
            Size: {{ item.size }}, Color: {{ item.color }}, Quantity: {{ item.quantity }}
          </li>
        </ul>
        <p><strong>Status:</strong> {{ order.status }}</p>
      </li>
    </ul>
  </div>
</template>
