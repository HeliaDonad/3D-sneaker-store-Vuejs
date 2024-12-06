<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useRouter } from 'vue-router';

const orders = ref([]); // Orders list
const error = ref(''); // Error message
const isAdmin = ref(false); // Check if user is admin
const totalOrders = ref(0); // Total orders counter
const socket = io('http://localhost:3000'); // Connect to Socket.IO server
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

// Fetch orders from backend
const fetchOrders = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    error.value = 'You are not logged in. Please log in to view orders.';
    return;
  }

  try {
    const response = await axios.get('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    orders.value = response.data.data;
    totalOrders.value = orders.value.length;
  } catch (err) {
    console.error('Error fetching orders:', err);
    error.value = 'Failed to fetch orders. Please try again later.';
  }
};

// Setup socket listeners for live updates
const setupSocketListeners = () => {
  socket.on('orderUpdate', (update) => {
    if (update.type === 'new') {
      orders.value.push(update.data);
      totalOrders.value++;
    } else if (update.type === 'update') {
      const index = orders.value.findIndex((order) => order._id === update.data._id);
      if (index !== -1) orders.value[index] = update.data;
    } else if (update.type === 'delete') {
      orders.value = orders.value.filter((order) => order._id !== update.data);
      totalOrders.value--;
    }
  });
};

// Mount and unmount
onMounted(() => {
  checkAdminStatus();
  fetchOrders();
  setupSocketListeners();
});

onUnmounted(() => {
  socket.disconnect();
});

// Update order status
const updateOrderStatus = async (orderId, newStatus) => {
  const token = localStorage.getItem('token');
  if (!isAdmin.value) {
    alert('Only admins can update order status.');
    return;
  }

  try {
    const response = await axios.patch(
      `https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${orderId}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.status === 'success') {
      socket.emit('orderUpdated', response.data.data); // Trigger socket update
      alert('Order status updated successfully!');
    } else {
      alert('Failed to update order status.');
    }
  } catch (err) {
    console.error('Error updating order status:', err);
    alert('Failed to update order status.');
  }
};

// Delete order
const deleteOrder = async (orderId) => {
  const token = localStorage.getItem('token');
  if (!isAdmin.value) {
    alert('Only admins can delete orders.');
    return;
  }

  try {
    const response = await axios.delete(
      `https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.status === 'success') {
      socket.emit('orderDeleted', orderId); // Trigger socket delete
      alert('Order deleted successfully!');
    } else {
      alert(`Failed to delete order: ${response.data.message}`);
    }
  } catch (err) {
    console.error('Error deleting order:', err);
    alert('Failed to delete order. Please try again.');
  }
};
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
        class="border p-4 rounded shadow flex justify-between items-center"
      >
        <div>
          <p><strong>Order ID:</strong> {{ order._id }}</p>
          <p>
            <strong>Status: </strong>
            <span
              :class="{
                'text-yellow-500': order.status === 'Pending',
                'text-blue-500': order.status === 'In Production',
                'text-green-500': order.status === 'Shipped',
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
            @click="updateOrderStatus(order._id, 'In Production')"
            class="bg-blue-500 text-white px-2 py-1 rounded"
          >
            In Production
          </button>
          <button
            v-if="order.status === 'In Production'"
            @click="updateOrderStatus(order._id, 'Shipped')"
            class="bg-green-500 text-white px-2 py-1 rounded"
          >
            Shipped
          </button>
          <button
            @click="deleteOrder(order._id)"
            class="bg-red-500 text-white px-2 py-1 rounded"
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
</style>
