<script setup>
import { ref, onMounted } from 'vue';

const cart = ref([]); // Lokale winkelwagen

// Functie om de winkelwagen vanuit localStorage te laden
const loadCart = () => {
  const storedCart = localStorage.getItem('cart');
  cart.value = storedCart ? JSON.parse(storedCart) : []; // Ophalen of initialiseren als lege array
};

// Functie om een product uit de winkelwagen te verwijderen
const removeItem = (index) => {
  cart.value.splice(index, 1); // Verwijder het item uit de array
  localStorage.setItem('cart', JSON.stringify(cart.value)); // Werk de localStorage bij
};

// Laad de winkelwagen bij het laden van de component
onMounted(loadCart);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Your Bag</h1>

    <!-- Controleer of de winkelwagen leeg is -->
    <div v-if="cart.length === 0" class="text-gray-500">
      Your bag is empty.
    </div>

    <!-- Toon de winkelwagen als er producten zijn -->
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
/* Voeg optionele stijlen toe als nodig */
</style>
