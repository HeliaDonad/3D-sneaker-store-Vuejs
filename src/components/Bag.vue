<script setup>
import { ref } from 'vue';

const cart = ref([]);

// Laad cart bij component mount
const loadCart = () => {
  const storedCart = localStorage.getItem('cart');
  cart.value = storedCart ? JSON.parse(storedCart) : [];
};

const placeOrder = () => {
  const storedOrders = localStorage.getItem('orders');
  const orders = storedOrders ? JSON.parse(storedOrders) : [];
  orders.push({
    items: cart.value,
    status: 'Pending', // Initiële status
  });
  localStorage.setItem('orders', JSON.stringify(orders));
  cart.value = [];
  localStorage.removeItem('cart'); // Maak cart leeg na het plaatsen van een bestelling
  alert('Order placed successfully!');
};

// Initialiseer cart
loadCart();
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Your Bag</h1>
    <div v-if="cart.length === 0" class="text-gray-500">
      Your bag is empty.
    </div>
    <ul v-else class="space-y-4">
      <li
        v-for="(item, index) in cart"
        :key="index"
        class="border p-4 rounded shadow"
      >
        <p><strong>Size:</strong> {{ item.size }}</p>
        <p><strong>Color:</strong> {{ item.color }}</p>
        <p><strong>Quantity:</strong> {{ item.quantity }}</p>
      </li>
    </ul>
    <button
      v-if="cart.length > 0"
      @click="placeOrder"
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Place Order
    </button>
  </div>
</template>
