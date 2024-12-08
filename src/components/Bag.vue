<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cart = ref([]);
const showPopup = ref(false); // Popup voor gebruikersgegevens
const guestName = ref('');
const guestEmail = ref('');

// Initialiseer winkelwagen vanuit localStorage
const initializeCart = () => {
  const storedCart = localStorage.getItem('cart');
  cart.value = storedCart ? JSON.parse(storedCart) : [];
};

// Werk een cart-item bij
const updateCartItem = (index, updatedItem) => {
  cart.value[index] = updatedItem;
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

// Verwijder een item uit de winkelwagen
const removeCartItem = (index) => {
  cart.value.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

// Plaats een bestelling
const placeOrder = async () => {
  if (cart.value.length === 0) {
    alert('Your cart is empty. Please add items before placing an order.');
    return;
  }

  // Toon popup om gegevens in te vullen
  showPopup.value = true;
};

const submitGuestDetails = async () => {
  if (!guestName.value || !guestEmail.value) {
    alert('Please fill in all required fields.');
    return;
  }

  const payload = {
    contactInfo: {
      name: guestName.value,
      email: guestEmail.value,
    },
    items: cart.value.map(item => ({
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
    })),
  };

  const token = localStorage.getItem('token'); // Haal token op uit localStorage

  try {
    const response = await fetch('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '', // Voeg token toe als deze aanwezig is
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error placing order:', errorText);
      alert(`Failed to place order: ${errorText}`);
      return;
    }

    const result = await response.json();
    if (result.status === 'success') {
      localStorage.removeItem('cart');
      cart.value = [];
      alert('Order placed successfully!');
    } else {
      console.error('Unexpected API response:', result);
      alert('Failed to place order: ' + result.message || 'Unexpected error.');
    }
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Error placing order: ' + error.message);
  } finally {
    showPopup.value = false; // Sluit popup na afronding
  }
};


// Werk de status van een bestelling bij via PATCH
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await axios.patch(
      `https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders/${orderId}`,
      { status: newStatus },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Zorg dat je token correct is
        },
      }
    );
    console.log('Order bijgewerkt:', response.data);
  } catch (err) {
    console.error('Error updating order status:', err);
  }
};

// Initialiseer de winkelwagen bij laden van de component
initializeCart();

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="nav bg-gray-500 text-white p-4">
      <img src="../assets/images/SWEAR_Logo_black.avif" alt="" class="headerLogo">
      <h1 class="navItem text-2xl font-bold cursor-pointer" @click="goBack">GO BACK</h1>
    </header>
    <div class="p-6">
      <h2 class="text-lg font-semibold">YOUR BAG</h2>
      <ul>
        <li v-for="(item, index) in cart" :key="index" class="flex items-center justify-between py-2">
          <div class="flex items-center space-x-4">
            <span> Size: {{ item.size }} </span>
            <span class="mr-4"> Quantity: {{ item.quantity }}x</span>
          </div>

          <div class="flex flex-col space-y-2">
            <label for="size"></label>
            <select v-model="item.size" @change="updateCartItem(index, item)" class="p-2 border rounded">
              <option v-for="size in ['36', '37', '38', '39', '40', '41', '42', '43', '44']" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>

          <div class="flex space-x-2">
            <button @click="item.quantity > 1 ? item.quantity-- : item.quantity" class="bg-gray-200 p-1">-</button>
            <input type="number" v-model="item.quantity" min="1" class="w-12 text-center border border-gray-300 py-1 rounded-md" @change="updateCartItem(index, item)" />
            <button @click="item.quantity++" class="bg-gray-200 p-1">+</button>
          </div>

          <button @click="removeCartItem(index)" class="bg-red-500 text-white py-2 px-2 rounded-md">Remove</button>
        </li>
      </ul>
      <button @click="placeOrder" class="orderBtn w-full py-2 mt-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-700">
        PLACE ORDER
      </button>
    </div>

    <!-- Popup voor gebruikersgegevens -->
    <div v-if="showPopup" class="fixed inset-0 flex items-start justify-center z-50 py-10">
      <div class="popup bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4 text-gray-900">Enter Your Details</h2>
        <form @submit.prevent="submitGuestDetails">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-900">Name</label>
            <input v-model="guestName" id="name" type="text" required class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-300" />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-900">Email</label>
            <input v-model="guestEmail" id="email" type="email" required class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-300" />
          </div>
          <button type="submit" class="w-full popup-btn bg-green-400 text-black font-bold py-2 rounded-lg hover:bg-green-500">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Globale stijlen voor consistentie */
.nav {
  background-color: #64f243;
  color: #000000;
  font-family: Helvetica;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  height: 60px;
}

.headerLogo {
  height: 25px;
}

.orderBtn {
  cursor: pointer;
  background-color: #64f243;
  color: #000000;
}

.orderBtn:hover {
  background-color: #63f243aa;
}

.navItem {
  font-size: 16px;
}

.navItem:hover {
  cursor: pointer;
  text-decoration: underline;
}

/* Stijlen voor de popup */
.popup {
  background-color: #f3f3f3; /* Lichte achtergrond */
  border: 2px solid #64f243;
  color: #000;
}

.popup-btn {
  background-color: #64f243;
  color: #000000;
}

.popup-btn:hover {
  background-color: #63f243aa;
}
</style>
