<template>
    <div class="orders">
      <h1>Orders Dashboard</h1>
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
    setup() {
      const orders = ref([]);
  
      const fetchOrders = async () => {
        const response = await axios.get('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        orders.value = response.data.data;
      };
  
      onMounted(() => {
        fetchOrders();
      });
  
      return { orders };
    },
  };
  </script>  
  
  <style scoped>
  .orders { padding: 20px; }
  </style>
  