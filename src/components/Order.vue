<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const order = ref(null);

const loadOrderDetails = () => {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const orderId = route.params.id;
  order.value = orders.find((o) => o.id === orderId);
};

onMounted(() => {
  loadOrderDetails();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Order Details</h1>
    <div v-if="!order" class="text-gray-500">
      Order not found.
    </div>
    <div v-else>
      <p><strong>Order ID:</strong> {{ order.id }}</p>
      <ul>
        <li
          v-for="(item, index) in order.items"
          :key="index"
          class="border p-2 my-2 rounded"
        >
          <p><strong>Size:</strong> {{ item.size }}</p>
          <p><strong>Quantity:</strong> {{ item.quantity }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Voeg extra stijlen toe indien nodig */
</style>
