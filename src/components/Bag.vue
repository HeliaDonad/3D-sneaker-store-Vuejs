<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cart = ref([]); // Lokale winkelwagen
const showNotification = ref(false);
const notificationMessage = ref('');
const isLoggedIn = ref(false); // Inlogstatus

// Controleer de loginstatus bij component mount
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
};

// Laad de winkelwagen vanuit localStorage
const loadCart = () => {
  const storedCart = localStorage.getItem('cart');
  cart.value = storedCart ? JSON.parse(storedCart) : []; // Ophalen of initialiseren als lege array
};

// Verwijder een product uit de winkelwagen
const removeItem = (index) => {
  cart.value.splice(index, 1); // Verwijder het item uit de array
  localStorage.setItem('cart', JSON.stringify(cart.value)); // Werk de localStorage bij
};

// Plaats een bestelling
const placeOrder = () => {
  if (!isLoggedIn.value) {
    notificationMessage.value = 'Please log in to place your order!';
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 3000);
    router.push('/login'); // Stuur naar loginpagina
    return;
  }

  if (cart.value.length === 0) {
    notificationMessage.value = 'Your bag is empty!';
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 3000);
    return;
  }

  // Plaats de bestelling (simulatie)
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const newOrder = {
    id: orders.length + 1,
    items: [...cart.value],
    status: 'Pending',
  };
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));

  cart.value = []; // Maak de winkelwagen leeg
  localStorage.removeItem('cart'); // Werk localStorage bij
  notificationMessage.value = 'Order placed successfully!';
  showNotification.value = true;

  setTimeout(() => (showNotification.value = false), 3000);
  router.push('/orders'); // Navigeer naar de bestellingenpagina
};

// Controleer login en laad de winkelwagen bij component mount
onMounted(() => {
  checkLoginStatus();
  loadCart();
});
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

    <!-- Plaats bestelling knop -->
    <div v-if="cart.length > 0" class="mt-6">
      <button
        @click="placeOrder"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Place Order
      </button>
    </div>

    <!-- Notificatie -->
    <div
      v-if="showNotification"
      class="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2"
    >
      {{ notificationMessage }}
    </div>
  </div>
</template>

<style scoped>
/* Voeg optionele stijlen toe indien nodig */
</style>
