<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cart = ref([]); // Lokale winkelwagen
const showNotification = ref(false);
const notificationMessage = ref('');

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

// Functie om een bestelling te plaatsen
const placeOrder = async () => {
  if (cart.value.length === 0) {
    notificationMessage.value = 'Your bag is empty!';
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 3000);
    return;
  }

  try {
    const response = await fetch('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ items: cart.value }),
    });

    if (response.ok) {
      cart.value = []; // Leeg de winkelwagen
      localStorage.removeItem('cart'); // Verwijder winkelwagen uit localStorage
      notificationMessage.value = 'Order placed successfully!';
      showNotification.value = true;
      setTimeout(() => (showNotification.value = false), 3000);
      router.push('/orders'); // Navigeer naar orders pagina
    } else {
      throw new Error('Failed to place order.');
    }
  } catch (error) {
    notificationMessage.value = error.message;
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 3000);
  }
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
/* Voeg optionele stijlen toe als nodig */
</style>
