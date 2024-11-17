<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const order = ref(null);

const fetchOrder = async () => {
  try {
    const response = await axios.get(`https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${route.params.id}`);
    order.value = response.data.data;
  } catch (error) {
    console.error('Fout bij ophalen van bestelling:', error);
  }
};

onMounted(fetchOrder);
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-4">Bestelling {{ order?.id }}</h1>
    <p><strong>Status:</strong> {{ order?.status }}</p>
    <p><strong>Klant:</strong> {{ order?.customer }}</p>
    <p><strong>Details:</strong> {{ order?.details }}</p>
    <!-- Mogelijkheid om status bij te werken -->
  </div>
</template>

<style scoped>
/* Styling kan hier worden toegevoegd */
</style>
