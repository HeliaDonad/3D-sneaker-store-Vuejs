<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false);

const orders = ref([]); // Bestellingen van de gebruiker
const error = ref('');

const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
};

// Controleer loginstatus bij component mount
checkLoginStatus();

const cart = ref([]); // Lokale winkelwagen
const selectedSize = ref('36'); // Standaardmaat
const selectedColor = ref('gray'); // Standaardkleur
const quantity = ref(1); // Standaardhoeveelheid

// Notificatiebalk status
const showNotification = ref(false);
const notificationMessage = ref('');

// Initialiseer de winkelwagen vanuit localStorage
const initializeCart = () => {
  const storedCart = localStorage.getItem('cart');
  cart.value = storedCart ? JSON.parse(storedCart) : [];
};

// Voeg een product toe aan de winkelwagen
const addToCart = () => {
  const product = {
    size: selectedSize.value,
    color: selectedColor.value,
    quantity: quantity.value,
  };

  // Voeg het nieuwe product toe aan de bestaande winkelwagen
  const storedCart = localStorage.getItem('cart');
  const updatedCart = storedCart ? JSON.parse(storedCart) : [];
  updatedCart.push(product);

  // Update de winkelwagen in localStorage
  localStorage.setItem('cart', JSON.stringify(updatedCart));

  // Toon een notificatie
  showNotification.value = true;
  notificationMessage.value = 'Product added to your bag!';

  // Verberg de notificatie na 3 seconden
  setTimeout(() => {
    showNotification.value = false;
    notificationMessage.value = '';
  }, 3000);
};

// Verhoog de hoeveelheid
const increaseQuantity = () => {
  quantity.value++;
};

// Verlaag de hoeveelheid
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const fetchOrders = async () => {
  try {
    const response = await axios.get('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/dashboard', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Voeg de JWT-token toe
      },
    });
    orders.value = response.data.data.orders;
  } catch (err) {
    console.error('Error fetching orders:', err);
    error.value = err.response?.data?.message || 'Failed to fetch orders.';
  }
};

// Haal bestellingen op zodra het component geladen is
onMounted(fetchOrders);
// Initialiseer de winkelwagen bij component mount
initializeCart();
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-gray-500 text-white p-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Flux.be</h1>
      <nav>
        <ul class="flex space-x-4">
          <li v-if="!isLoggedIn">
            <router-link to="/bag" class="hover:underline">Bag</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/bag" class="hover:underline">Bag</router-link>
          </li>
          <li>
            <button
              v-if="!isLoggedIn"
              @click="() => router.push('/login')"
              class="hover:underline"
            >
              Account
            </button>
            <div v-else>
              <button @click="() => router.push('/account')" class="hover:underline">
                Account
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </header>

       <!-- Notificatiebalk -->
    <div
      v-if="showNotification"
      class="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2 z-50"
    >
      {{ notificationMessage }}
    </div>

    <main class="p-6">
      <h2 v-if="!isLoggedIn">Welcome to the 3D Sneaker Store! Please log in to personalize your experience.</h2>
      <h2 v-else>Welcome back! Manage your account and explore your dashboard.</h2>
    </main>

    <!-- Hoofdinhoud -->
    <div class="flex flex-grow">
      <main class="flex-grow p-4 bg-white shadow-inner">
        <div class="flex flex-wrap lg:flex-nowrap">
          <!-- Productafbeelding -->
          <div class="flex-none w-full lg:w-3/4 mb-4 relative z-10">
            <div class="w-full h-96 bg-gray-200">
              <img src="#" alt="Product" class="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>

          <!-- Productconfiguratie -->
          <form @submit.prevent="addToCart" class="flex-auto pl-6">
            <div class="relative flex flex-wrap items-baseline pb-6">
              <h1 class="relative w-full flex-none mb-2 text-2xl font-semibold text-gray-800">
                Create your own Sneaker
              </h1>
              <div class="relative text-lg text-gray-500">€89.00</div>
              <div class="relative uppercase text-gray-400 ml-3">In stock</div>
            </div>

            <!-- Maatopties -->
            <div class="flex flex-wrap my-4">
              <div class="flex flex-wrap text-sm font-medium">
                <label v-for="size in ['36', '37', '38', '39', '40', '41', '42', '43', '44']" :key="size" class="w-1/5 mb-2">
                  <input
                    class="sr-only peer"
                    type="radio"
                    :value="size"
                    v-model="selectedSize"
                  />
                  <div
                    class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white"
                  >
                    {{ size }}
                  </div>
                </label>
              </div>
            </div>

            <!-- Kleurkeuze -->
            <div class="flex items-baseline my-6">
              <div class="space-x-3 flex text-sm font-medium">
                <label
                v-for="color in ['gray', '#8c1db1', 'blue', 'green', 'red']"
                :key="color"
              >
                <input
                  class="sr-only peer"
                  type="radio"
                  :value="color"
                  v-model="selectedColor"
                />
                <div
                  class="relative w-10 h-10 flex items-center justify-center peer-checked:ring-4 peer-checked:ring-gray-400 rounded-full"
                  :style="{ backgroundColor: color.startsWith('#') ? color : '' }"
                  :class="color.startsWith('#') ? '' : `bg-${color}-500`"
                ></div>
              </label>
              </div>
            </div>

            <!-- Hoeveelheid -->
            <div class="my-4">
              <label class="block text-sm font-medium text-gray-800 mb-2">Quantity</label>
              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  @click="decreaseQuantity"
                  class="text-gray-500 border border-gray-300 px-2 py-1 rounded-md hover:bg-gray-200"
                >
                  -
                </button>
                <input
                  type="number"
                  v-model="quantity"
                  min="1"
                  class="w-12 text-center border border-gray-300 py-1 rounded-md"
                />
                <button
                  type="button"
                  @click="increaseQuantity"
                  class="text-gray-500 border border-gray-300 px-2 py-1 rounded-md hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Toevoegen aan winkelwagen -->
            <div class="my-4">
              <button
                type="submit"
                class="w-full py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-700"
              >
                Add to Cart
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
