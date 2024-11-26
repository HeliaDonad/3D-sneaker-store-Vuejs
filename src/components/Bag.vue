<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cart = ref([]);

// Initialize cart from localStorage
const initializeCart = () => {
  const storedCart = localStorage.getItem('cart');
  cart.value = storedCart ? JSON.parse(storedCart) : [];

  // Debug: Check if cart contains required fields
  console.log("Cart items loaded:", cart.value);  // Ensure productId exists here
  cart.value.forEach(item => {
    console.log(`Item in cart: productId=${item.productId}, size=${item.size}, quantity=${item.quantity}`);
  });
};

// Update the cart item with new size or quantity
const updateCartItem = (index, updatedItem) => {
  cart.value[index] = updatedItem;
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

// Remove item from the cart
const removeCartItem = (index) => {
  cart.value.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

// Ensure that the productId is correctly added to the cart when placing the order
const placeOrder = async () => {
  if (cart.value.length === 0) {
    alert('Your cart is empty. Please add items before placing an order.');
    return;
  }

  const payload = {
    contactInfo: {
      name: "Jane Smith", 
      email: "janesmith@example.com",
    },
    status: "Verzonden",
    items: cart.value.map(item => ({
      productId: item.productId,  // Ensure productId exists here
      size: item.size,
      quantity: item.quantity,
    })),
  };

  // Debug: Check payload before sending
  console.log("Payload for order:", payload);

  const invalidItems = payload.items.filter(item => !item.productId || !item.size || !item.quantity);
  if (invalidItems.length > 0) {
    alert('One or more items in your cart are missing required information (productId, size, or quantity).');
    return;
  }

  try {
    const response = await fetch('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
      alert('Order placed successfully!');
      cart.value = [];
    } else {
      console.error('Unexpected API response:', result);
      alert('Failed to place order: ' + result.message || 'Unexpected error.');
    }
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Error placing order: ' + error.message);
  }
};


// Initialize the cart on component mount
initializeCart();
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-gray-500 text-white p-4">
      <h1 class="text-2xl font-bold">Your Cart</h1>
    </header>
    <div class="p-6">
      <h2 class="text-lg font-semibold">Items in your cart</h2>
      <ul>
        <li v-for="(item, index) in cart" :key="index" class="flex items-center justify-between py-2">
          <div class="flex items-center">
            <span class="mr-4">{{ item.quantity }}x</span>
            <span>{{ item.size }}</span>
          </div>

          <!-- Size Options (Editable) -->
          <div class="flex flex-col space-y-2">
            <label for="size">Size</label>
            <select v-model="item.size" @change="updateCartItem(index, item)" class="p-2 border rounded">
              <option v-for="size in ['36', '37', '38', '39', '40', '41', '42', '43', '44']" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>

          <!-- Quantity and customization controls -->
          <div class="flex space-x-2">
            <button @click="item.quantity > 1 ? item.quantity-- : item.quantity" class="bg-gray-200 p-1">-</button>
            <input type="number" v-model="item.quantity" min="1" class="w-12 text-center border border-gray-300 py-1 rounded-md" @change="updateCartItem(index, item)" />
            <button @click="item.quantity++" class="bg-gray-200 p-1">+</button>
          </div>

          <!-- Remove item button -->
          <button @click="removeCartItem(index)" class="bg-red-500 text-white p-1 rounded-md">Remove</button>
        </li>
      </ul>
      <button
        @click="placeOrder"
        class="w-full py-2 mt-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-700"
      >
        Place Order
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add your custom styles if needed */
</style>
