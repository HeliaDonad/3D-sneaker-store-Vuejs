<template>
    <div class="orders">
      <h1>Orders</h1>
      <p>Total Orders: {{ orders.length }}</p>
      <ul>
        <li v-for="order in orders" :key="order._id">
          <router-link :to="'/orders/' + order._id">{{ order.customerName }} - {{ order.status }}</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'Orders',
    setup() {
      const orders = ref([]);
  
      const fetchOrders = async () => {
        try {
          const response = await axios.get('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders');
          orders.value = response.data.data;
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
  
      onMounted(() => {
        fetchOrders();
      });
  
      return { orders };
    }
  }
  </script>
  
  <style scoped>
  .orders { padding: 20px; }
  </style>
  