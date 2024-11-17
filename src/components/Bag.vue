<script setup>
import { ref, onMounted } from 'vue';

const cart = ref([]); // Cart array

// Load cart from localStorage on mount
onMounted(() => {
  const savedCart = localStorage.getItem('cart');
  cart.value = savedCart ? JSON.parse(savedCart) : []; // Load cart or initialize as empty
});

// Function to remove an item from the cart
const removeItem = (index) => {
  cart.value.splice(index, 1); // Remove the item from the array
  localStorage.setItem('cart', JSON.stringify(cart.value)); // Update localStorage
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Your Bag</h1>
    <div v-if="cart.length === 0" class="text-gray-500">
      Your bag is empty.
    </div>
    <ul v-else class="space-y-4">
      <li
        v-for="(item, index) in cart"
        :key="index"
        class="border p-4 rounded shadow flex justify-between items-center"
      >
        <div>
          <p><strong>Size:</strong> {{ item.size }}</p>
          <p><strong>Color:</strong> {{ item.color }}</p>
          <p><strong>Quantity:</strong> {{ item.quantity }}</p>
        </div>
        <button
          @click="removeItem(index)"
          class="bg-red-500 text-white px-2 py-1 rounded"
        >
          Remove
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Add any necessary styles */
</style>
