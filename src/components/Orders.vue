<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useRouter } from 'vue-router';

const orders = ref([]); // Orders list
const error = ref(''); // Error message
const isAdmin = ref(false); // Check if user is admin
const totalOrders = ref(0); // Total orders counter
const isProcessing = ref(false); // Loading indicator for buttons
const router = useRouter(); // Vue Router for navigation

// Check if user is admin
const checkAdminStatus = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      isAdmin.value = decoded.isAdmin || false;
    } catch {
      isAdmin.value = false;
    }
  }
};

const socket = io('https://threed-sneaker-store-seda-ezzat-helia.onrender.com', {
  transports: ['websocket', 'polling'], // Gebruik websocket en polling
  withCredentials: true, // Sta cookies/auth headers toe
});

socket.on('connect', () => {
  console.log('Verbonden met WebSocket:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Verbinding verbroken');
});

// Fetch orders from backend
const fetchOrders = async (fetchAll = false) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found. User might not be logged in.');
    error.value = 'You need to log in to access orders.';
    return;
  }

  try {
    const response = await axios.get(
      `https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          all: fetchAll, // Haal alle orders op als fetchAll true is
        },
      }
    );
    orders.value = response.data.data;
    totalOrders.value = orders.value.length; // Update totalOrders
  } catch (err) {
    console.error('Error fetching orders:', err);
    error.value = err.response?.data?.message || 'Failed to fetch orders.';
  }
};

// Setup socket listeners for live updates
const setupSocketListeners = () => {
  socket.on('orderUpdate', (update) => {
    if (update.type === 'new') {
      orders.value.push(update.data);
    } else if (update.type === 'update') {
      const index = orders.value.findIndex((order) => order._id === update.data._id);
      if (index !== -1) orders.value[index] = update.data;
    } else if (update.type === 'delete') {
      orders.value = orders.value.filter((order) => order._id !== update.data);
    }
    totalOrders.value = orders.value.length; // Update totalOrders na elke wijziging
  });
};

// Mount and unmount
onMounted(() => {
  checkAdminStatus();
  fetchOrders(true); // Haal standaard alle orders op
  setupSocketListeners();
});

onUnmounted(() => {
  socket.disconnect();
});
</script>


<template>
  <div class="p-6">
    <h1 v-if="isAdmin" class="text-2xl font-bold mb-4">All Orders (Admin) - Total: {{ totalOrders }}</h1>
    <h1 v-else class="text-2xl font-bold mb-4">My Orders</h1>

    <!-- Error message -->
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

    <!-- No orders -->
    <div v-if="orders.length === 0 && !error" class="text-gray-500">
      No orders found.
    </div>

    <!-- Orders list -->
    <ul v-else class="space-y-4">
      <li
        v-for="order in orders"
        :key="order._id"
        class="border p-4 rounded shadow flex flex-col space-y-4"
      >
        <div>
          <p><strong>Order ID:</strong> {{ order._id }}</p>
          <p>
            <strong>Status: </strong>
            <span
              :class="{
                'text-yellow-500': order.status === 'Pending',
                'text-blue-500': order.status === 'In productie',
                'text-green-500': order.status === 'Verzonden',
                'text-red-500': order.status === 'Geannuleerd'
              }"
            >
              {{ order.status }}
            </span>
          </p>
          <router-link :to="`/orders/${order._id}`" class="text-blue-500 underline">
            View Details
          </router-link>
        </div>

        <!-- Admin Actions -->
        <div v-if="isAdmin" class="flex space-x-2">
  <button
    v-if="order.status === 'Pending'"
    @click="updateOrderStatus(order._id, 'In productie')"
    class="bg-blue-500 text-white px-2 py-1 rounded"
  >
    In productie
  </button>
  <button
    v-if="order.status === 'In productie'"
    @click="updateOrderStatus(order._id, 'Verzonden')"
    class="bg-green-500 text-white px-2 py-1 rounded"
  >
    Verzonden
  </button>
  <button
    v-if="order.status !== 'Geannuleerd'"
    @click="updateOrderStatus(order._id, 'Geannuleerd')"
    class="bg-red-500 text-white px-2 py-1 rounded"
  >
    Geannuleerd
  </button>
          <button
            @click="deleteOrder(order._id)"
            class="bg-gray-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
button {
  font-weight: bold;
}
.text-yellow-500 {
  color: #facc15;
}
.text-blue-500 {
  color: #3b82f6;
}
.text-green-500 {
  color: #22c55e;
}
.text-red-500 {
  color: #ef4444;
}

</style>
