<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false);
const cart = ref([]); // Local cart
const selectedSize = ref(''); // Default size
const selectedColor = ref(''); // Default color
const quantity = ref(1); // Default quantity

const showNotification = ref(false);
const notificationMessage = ref('');

// Check login status
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
};

// Initialize the cart from localStorage
const initializeCart = () => {
  const storedCart = localStorage.getItem('cart');
  cart.value = storedCart ? JSON.parse(storedCart) : [];

  // Ensure there is an orderId in localStorage
  if (!localStorage.getItem('orderId')) {
    localStorage.setItem('orderId', new Date().getTime().toString()); // Generate a unique orderId
  }
};

// Add item to cart
const addToCart = () => {
  // Use a valid ObjectId for testing
  const productId = '60d5ec49f1b2c12a4c8e4d5a'; // Replace this with the actual productId

  // Validate and convert productId to a format that your backend expects
  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
  const validProductId = isValidObjectId(productId) ? productId : null;

  if (!validProductId) {
    console.error('Invalid productId');
    return;
  }

  const product = {
    productId: validProductId, // Use the validated productId here
    size: selectedSize.value,
    color: selectedColor.value,
    quantity: quantity.value,
  };

  // Retrieve the current cart from localStorage
  const storedCart = localStorage.getItem('cart');
  const updatedCart = storedCart ? JSON.parse(storedCart) : [];
  updatedCart.push(product);

  // Update cart in localStorage
  localStorage.setItem('cart', JSON.stringify(updatedCart));

  // Show notification
  showNotification.value = true;
  notificationMessage.value = 'Product added to your bag!';

  // Hide notification after 3 seconds
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};


// Create an order
const createOrder = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    notificationMessage.value = 'You need to log in first!';
    showNotification.value = true;
    return;
  }

  const cartData = cart.value;
  console.log('Cart Data:', cartData); // Debugging line

  try {
    const response = await fetch('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cartData,
      }),
    });

    const result = await response.json();
    console.log('API Response:', result); // Debugging line

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create order');
    }

    // If the order is successfully created, clear the cart
    localStorage.removeItem('cart');
    cart.value = [];

    notificationMessage.value = 'Order placed successfully!';
    showNotification.value = true;

    // Hide notification after 3 seconds
    setTimeout(() => {
      showNotification.value = false;
      notificationMessage.value = '';
    }, 3000);

    router.push('/orders'); // Redirect to orders page
  } catch (error) {
    console.error('Error creating order:', error);
    notificationMessage.value = `Error: ${error.message}`;
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 3000);
  }
};

// Initialize cart when the component is mounted
onMounted(() => {
  checkLoginStatus();
  initializeCart();
});
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

    <!-- Notification Bar -->
    <div v-if="showNotification" class="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-2 z-50">
      {{ notificationMessage }}
    </div>

    <main class="p-6">
      <h2 v-if="!isLoggedIn">Welcome to the 3D Sneaker Store! Please log in to personalize your experience.</h2>
      <h2 v-else>Welcome back! Manage your account and explore your dashboard.</h2>
    </main>

    <!-- Main Content -->
    <div class="flex flex-grow">
      <main class="flex-grow p-4 bg-white shadow-inner">
        <div class="flex flex-wrap lg:flex-nowrap">
          <!-- Product Image -->
          <div class="flex-none w-full lg:w-3/4 mb-4 relative z-10">
            <div class="w-full h-96 bg-gray-200">
              <img src="#" alt="Product" class="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>

          <!-- Product Configuration Form -->
          <form @submit.prevent="addToCart" class="flex-auto pl-6">
            <div class="relative flex flex-wrap items-baseline pb-6">
              <h1 class="relative w-full flex-none mb-2 text-2xl font-semibold text-gray-800">Create your own Sneaker</h1>
              <div class="relative text-lg text-gray-500">€89.00</div>
              <div class="relative uppercase text-gray-400 ml-3">In stock</div>
            </div>

            <!-- Size Options -->
            <div class="flex flex-wrap my-4">
              <div class="flex flex-wrap text-sm font-medium">
                <label v-for="size in ['36', '37', '38', '39', '40', '41', '42', '43', '44']" :key="size" class="w-1/5 mb-2">
                  <input class="sr-only peer" type="radio" :value="size" v-model="selectedSize" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white">{{ size }}</div>
                </label>
              </div>
            </div>

            <!-- Color Options -->
            <div class="flex items-baseline my-6">
              <div class="space-x-3 flex text-sm font-medium">
                <label v-for="color in ['gray', '#8c1db1', 'blue', 'green', 'red']" :key="color">
                  <input class="sr-only peer" type="radio" :value="color" v-model="selectedColor" />
                  <div class="relative w-10 h-10 flex items-center justify-center peer-checked:ring-4 peer-checked:ring-gray-400 rounded-full" :style="{ backgroundColor: color.startsWith('#') ? color : '' }" :class="color.startsWith('#') ? '' : `bg-${color}-500`"></div>
                </label>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="my-4">
              <label class="block text-sm font-medium text-gray-800 mb-2">Quantity</label>
              <div class="flex items-center space-x-2">
                <button type="button" @click="quantity > 1 ? quantity-- : quantity" class="text-gray-500 border border-gray-300 px-2 py-1 rounded-md hover:bg-gray-200">-</button>
                <input type="number" v-model="quantity" min="1" class="w-12 text-center border border-gray-300 py-1 rounded-md" />
                <button type="button" @click="quantity++" class="text-gray-500 border border-gray-300 px-2 py-1 rounded-md hover:bg-gray-200">+</button>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <div class="my-4">
              <button type="submit" class="w-full py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-700">Add to Cart</button>
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
