<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false);
const showNotification = ref(false);
const notificationMessage = ref('');

const selectedSize = ref('36'); // Standaardmaat
const selectedColor = ref('gray'); // Standaardkleur
const quantity = ref(1); // Standaardhoeveelheid

// Controleer of de gebruiker is ingelogd
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
};

// Controleer loginstatus bij component mount
checkLoginStatus();

// Voeg een product toe aan de winkelwagen
const addToCart = () => {
  if (!isLoggedIn.value) {
    // Gebruiker is niet ingelogd, toon melding
    showNotification.value = true;
    notificationMessage.value = 'Log in to continue.';
    setTimeout(() => {
      showNotification.value = false;
      notificationMessage.value = '';
    }, 3000);
    return;
  }

  // Als de gebruiker is ingelogd, voer normale winkelwagenlogica uit
  const product = {
    size: selectedSize.value,
    color: selectedColor.value,
    quantity: quantity.value,
  };

  // Voeg product toe aan lokale winkelwagen (bijv. via localStorage)
  const storedCart = localStorage.getItem('cart');
  const updatedCart = storedCart ? JSON.parse(storedCart) : [];
  updatedCart.push(product);
  localStorage.setItem('cart', JSON.stringify(updatedCart));

  // Toon bevestigingsmelding
  showNotification.value = true;
  notificationMessage.value = 'Product added to your bag!';
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
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-gray-500 text-white p-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Flux.be</h1>
      <nav>
        <ul class="flex space-x-4">
          <li>
            <router-link to="/login" class="hover:underline">Log In</router-link>
          </li>
          <li>
            <router-link to="/register" class="hover:underline">Register</router-link>
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
      <h2>Welcome to the 3D Sneaker Store!</h2>
      <p class="mt-2">
        Log in or register to access your personalized dashboard and view your orders.
      </p>
    </main>

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
