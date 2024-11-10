<template>
    <div class="order-detail">
      <h1>Order Details</h1>
      <p>Customer: {{ order.customerName }}</p>
      <p>Status: {{ order.status }}</p>
      <button @click="updateStatus('shipped')">Mark as Shipped</button>
      <button @click="deleteOrder">Delete Order</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  export default {
    setup() {
      const route = useRoute();
      const order = ref({});
  
      const fetchOrder = async () => {
        const response = await axios.get(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${route.params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        order.value = response.data.data;
      };
  
      const updateStatus = async (status) => {
        await axios.patch(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${route.params.id}`, { status }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        order.value.status = status;
      };
  
      const deleteOrder = async () => {
        await axios.delete(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${route.params.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.$router.push('/orders');
      };
  
      onMounted(() => {
        fetchOrder();
      });
  
      return { order, updateStatus, deleteOrder };
    },
  };
  </script>  
  
  <style scoped>
  .order-detail { padding: 20px; }
  </style>
  