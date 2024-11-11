<template>
  <div class="orders">
    <h1>Orders Dashboard</h1>
    <p>Total Orders: {{ orders.length }}</p>
    <ul>
      <li v-for="order in orders" :key="order._id">
        <router-link :to="'/order/' + order._id">{{ order.customerName }} - {{ order.status }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { io } from 'socket.io-client';

export default {
  setup() {
    const orders = ref([]);
    const socket = io('https://threed-sneaker-store-seda-ezzat-helia.onrender.com');

    const fetchOrders = async () => {
      const response = await axios.get('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      orders.value = response.data.data;
    };

    onMounted(() => {
      fetchOrders();

      socket.on('newOrder', (order) => {
        orders.value.push(order);
      });

      socket.on('updateOrder', (updatedOrder) => {
        const index = orders.value.findIndex(order => order._id === updatedOrder._id);
        if (index !== -1) {
          orders.value[index] = updatedOrder;
        }
      });

      socket.on('deleteOrder', (deletedOrder) => {
        orders.value = orders.value.filter(order => order._id !== deletedOrder._id);
      });
    });

    return { orders };
  },
};
</script>

<style scoped>
.orders { padding: 20px; }
</style>