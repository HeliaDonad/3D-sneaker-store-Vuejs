<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client';

const router = useRouter();
const isLoggedIn = ref(false);
const cart = ref([]); // Winkelwagen
const selectedSize = ref(''); // Gekozen maat
const selectedColor = ref(''); // Gekozen kleur
const quantity = ref(1); // Aantal stuks
const products = ref([]); // Productgegevens van de backend

// Voor notificaties en popup
const showNotification = ref(false);
const notificationMessage = ref('');
const showPopup = ref(false);
const guestName = ref('');
const guestEmail = ref('');
const guestPhone = ref(''); // Telefoonnummer van de gast

// WebSocket voor live updates (admin-only)
const socket = ref(null);

// Controleer loginstatus
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token; // Controleer op aanwezigheid van token
};

// Haal producten op van de backend
const fetchProducts = async () => {
  try {
    const response = await fetch('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/products');
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const result = await response.json();
    products.value = result.data; // Opslaan van producten
    console.log('Products fetched:', products.value); // Debugging
  } catch (error) {
    console.error('Error fetching products:', error.message);
  }
};


// Initialiseer winkelwagen
const initializeCart = () => {
  cart.value = [];
};

// Voeg een product toe aan de winkelwagen
const addToCart = (product) => {
  const cartItem = {
    productId: product._id,
    name: product.name,
    price: product.price,
    size: selectedSize.value,
    quantity: quantity.value,
  };

  cart.value.push(cartItem);
  showNotification.value = true;
  notificationMessage.value = `${product.name} added to your bag!`;

  setTimeout(() => (showNotification.value = false), 3000);
};


// Open popup voor niet-ingelogde gebruikers
const openPopup = () => {
  if (!isLoggedIn.value) {
    showPopup.value = true;
  }
};

// Verstuur gastgegevens en plaats bestelling
const submitGuestDetails = () => {
  if (guestName.value && guestEmail.value && guestPhone.value) {
    createOrder(guestName.value, guestEmail.value, guestPhone.value); // Voeg phone toe
    showPopup.value = false; // Sluit de popup
  } else {
    notificationMessage.value = 'Please fill in all required fields.';
    showNotification.value = true;

    setTimeout(() => {
      showNotification.value = false;
    }, 3000);
  }
};

// Bestelling maken
const createOrder = async (name, email, phone) => {
  console.log('Creating order with:', { name, email, phone, items: cart.value });

  try {
    const response = await fetch(
      'https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactInfo: { name, email, phone }, // Gebruikersgegevens
          items: cart.value, // Producten in de winkelwagen
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Order created:', result);
    notificationMessage.value = 'Order created successfully!';
    showNotification.value = true;

    setTimeout(() => {
      showNotification.value = false;
    }, 3000);

    // Cart leegmaken na succesvolle bestelling
    cart.value = [];
  } catch (error) {
    console.error('Error creating order:', error.message);
    notificationMessage.value = `Error: ${error.message}`;
    showNotification.value = true;

    setTimeout(() => {
      showNotification.value = false;
    }, 3000);
  }
};

// WebSocket configuratie
const setupWebSocket = () => {
  socket.value = io('https://threed-sneaker-store-seda-ezzat-helia.onrender.com');

  socket.value.on('connect', () => {
    console.log('WebSocket connected.');
  });

  socket.value.on('orderPlaced', (newOrder) => {
    console.log('New order placed:', newOrder);
  });

  socket.value.on('connect_error', (err) => {
    console.error('WebSocket connection error:', err.message);
  });
};

// Initialisatie bij laden van component
onMounted(async () => {
  checkLoginStatus();
  initializeCart();
  await fetchProducts(); // Zorg ervoor dat de producten worden opgehaald
  setupWebSocket();
});

</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-gray-500 text-white p-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Flux.be</h1>
      <nav>
        <ul class="flex space-x-4">
          <li><router-link to="/bag" class="hover:underline">Bag</router-link></li>
          <li>
            <button
              v-if="!isLoggedIn"
              @click="() => router.push('/login')"
              class="hover:underline"
            >
              Account
            </button>
            <button
              v-else
              @click="() => router.push('/account')"
              class="hover:underline"
            >
              Account
            </button>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Notification Bar -->
    <div v-if="showNotification" class="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2 z-50">
      {{ notificationMessage }}
    </div>

    <!-- Popup -->
    <div v-if="showPopup" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Enter Your Details</h2>
        <form @submit.prevent="submitGuestDetails">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="guestName" id="name" type="text" required class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="guestEmail" id="email" type="email" required class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div class="mb-4">
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
            <input
              v-model="guestPhone"
              id="phone"
              type="tel"
              required
              class="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg">Submit</button>
        </form>
      </div>
    </div>

    <!-- Main Content -->
    <main class="p-6">
      <div class="flex flex-wrap lg:flex-nowrap">
        <!-- Placeholder voor afbeelding -->
        <div class="w-full lg:w-1/2 bg-gray-200 flex items-center justify-center h-64">
          <p class="text-gray-600">Image Placeholder (to be replaced with Three.js)</p>
        </div>

        <!-- Product Configuratie -->
        <form @submit.prevent="openPopup" class="lg:w-1/2 p-4">
          <h1 class="text-2xl font-bold">Create Your Own Sneaker</h1>
          <p class="text-gray-600 mb-4">Prijs: €89.00</p>

          <!-- Size Selector -->
          <label for="size" class="block text-sm font-medium">Size</label>
          <div class="flex space-x-2 mb-4">
            <label v-for="size in ['36', '37', '38', '39', '40', '41', '42', '43', '44']" :key="size">
              <input type="radio" :value="size" v-model="selectedSize" class="hidden peer" />
              <div class="w-10 h-10 border rounded-lg flex items-center justify-center peer-checked:bg-gray-800 peer-checked:text-white">
                {{ size }}
              </div>
            </label>
          </div>

          <!-- Quantity Selector -->
          <label for="quantity" class="block text-sm font-medium">Quantity</label>
          <div class="flex items-center space-x-2 mb-4">
            <button type="button" @click="quantity > 1 && quantity--" class="px-2 py-1 border rounded">-</button>
            <input type="number" v-model="quantity" min="1" class="w-12 text-center border py-1 rounded" />
            <button type="button" @click="quantity++" class="px-2 py-1 border rounded">+</button>
          </div>

          <!-- Submit Button -->
<!-- Knop voor toevoegen aan winkelwagen -->
<button
  v-if="products.length > 0"
  type="button"
  @click="addToCart(products[0]?._id)"
  class="w-full bg-gray-800 text-white py-2 rounded-lg"
>
  Add to Cart
</button>
        </form>
      </div>
    </main>
  </div>
</template>
