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
    name: 'Order',
    setup() {
      const route = useRoute();
      const order = ref({});
  
      const fetchOrder = async () => {
        try {
          const response = await axios.get(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${route.params.id}`);
          order.value = response.data.data;
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      };
  
      const updateStatus = async (status) => {
        try {
          await axios.patch(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${route.params.id}`, { status });
          order.value.status = status;
        } catch (error) {
          console.error("Error updating order status:", error);
        }
      };
  
      const deleteOrder = async () => {
        try {
          await axios.delete(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${route.params.id}`);
          alert("Order deleted");
        } catch (error) {
          console.error("Error deleting order:", error);
        }
      };
  
      onMounted(() => {
        fetchOrder();
      });
  
      return { order, updateStatus, deleteOrder };
    }
  }
  </script>
  
  <style scoped>
  .order-detail { padding: 20px; }
  </style>
  