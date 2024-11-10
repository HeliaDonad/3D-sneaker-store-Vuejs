<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(true) // Voor demonstratiedoeleinden, stel in op true

const logout = () => {
  isLoggedIn.value = false
  router.push('/login')
}

const quantity = ref(1)

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <header class="bg-gray-500 text-white p-4 flex justify-between items-center shadow-md">
      <h1 class="text-2xl font-bold">3D Sneaker Store</h1>
      <!--<nav>
        <ul class="flex space-x-6">
          <li><router-link to="/orders" class="hover:underline">Orders</router-link></li>
          <li><router-link to="/change-password" class="hover:underline">Change Password</router-link></li>
          <li v-if="isLoggedIn">
            <button @click="logout" class="hover:underline">Logout</button>
          </li>
        </ul>
      </nav>-->
    </header>

    <!-- Main Layout -->
    <div class="flex flex-grow">

      <!-- Main Content -->
      <main class="flex-grow p-4 bg-white shadow-inner">
        <div class="flex flex-wrap lg:flex-nowrap">

          <!-- Product Image / 3D Configurator -->
          <div class="flex-none w-full lg:w-3/4 mb-4 relative z-10">
            <div class="w-full h-96 bg-gray-200">
              <!-- 3D configurator or larger product display space can be inserted here -->
              <img src="#" alt="Product" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            </div>
          </div>

          <!-- Product Details Form -->
          <form class="flex-auto pl-6">
            <div class="relative flex flex-wrap items-baseline pb-6">
              <h1 class="relative w-full flex-none mb-2 text-2xl font-semibold text-gray-800">
                Create your own Sneaker
              </h1>
              <div class="relative text-lg text-gray-500">
                €89.00
              </div>
              <div class="relative uppercase text-gray-400 ml-3">
                In stock
              </div>
            </div>

            <!-- Size Options -->
            <div class="flex flex-wrap my-4">
              <div class="flex flex-wrap text-sm font-medium">
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="36" checked />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    36
                  </div>
                </label>
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="37" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    37
                  </div>
                </label>
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="38" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    38
                  </div>
                </label>
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="39" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    39
                  </div>
                </label>
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="40" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    40
                  </div>
                </label>
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="41" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    41
                  </div>
                </label>
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="42" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    42
                  </div>
                </label>
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="43" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    43
                  </div>
                </label>
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="44" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    44
                  </div>
                </label>
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="45" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    45
                  </div>
                </label>
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="46" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    46
                  </div>
                </label>
                <label class="w-1/4 sm:w-1/6 md:w-1/5 mb-2">
                  <input class="sr-only peer" name="size" type="radio" value="47" />
                  <div class="relative w-10 h-10 flex items-center justify-center text-black peer-checked:bg-black peer-checked:text-white before:absolute before:z-[-1] before:top-0.5 before:left-0.5 before:w-full before:h-full peer-checked:before:bg-teal-400">
                    47
                  </div>
                </label>
              </div>
            </div>

            <!-- Color Options -->
            <div class="flex items-baseline my-6">
              <div class="space-x-3 flex text-sm font-medium">
                <label class="peer">
                  <input class="sr-only peer" name="color" type="radio" value="black" checked />
                  <div class="relative w-10 h-10 flex items-center justify-center bg-black text-white peer-checked:ring-4 peer-checked:ring-gray-400 rounded-full">
                  </div>
                </label>
                <label class="peer">
                  <input class="sr-only peer" name="color" type="radio" value="blue" />
                  <div class="relative w-10 h-10 flex items-center justify-center bg-blue-500 text-white peer-checked:ring-4 peer-checked:ring-gray-400 rounded-full">
                  </div>
                </label>
                <label class="peer">
                  <input class="sr-only peer" name="color" type="radio" value="green" />
                  <div class="relative w-10 h-10 flex items-center justify-center bg-green-500 text-white peer-checked:ring-4 peer-checked:ring-gray-400 rounded-full">
                  </div>
                </label>
                <label class="peer">
                  <input class="sr-only peer" name="color" type="radio" value="red" />
                  <div class="relative w-10 h-10 flex items-center justify-center bg-red-500 text-white peer-checked:ring-4 peer-checked:ring-gray-400 rounded-full">
                  </div>
                </label>
                <label class="peer">
                  <input class="sr-only peer" name="color" type="radio" value="white" />
                  <div class="relative w-10 h-10 flex items-center justify-center bg-white text-black peer-checked:ring-4 peer-checked:ring-gray-400 rounded-full">
                  </div>
                </label>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="my-4">
              <label class="block text-sm font-medium text-gray-800 mb-2">Quantity</label>
              <div class="flex items-center space-x-2">
                <button type="button" @click="decreaseQuantity" class="text-gray-500 border border-gray-300 px-2 py-1 rounded-md hover:bg-gray-200">-</button>
                <input type="number" v-model="quantity" class="w-12 text-center border border-gray-300 py-1 rounded-md" min="1" />
                <button type="button" @click="increaseQuantity" class="text-gray-500 border border-gray-300 px-2 py-1 rounded-md hover:bg-gray-200">+</button>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <div class="my-4">
              <button class="w-full py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-700">
                Add to Cart
              </button>
            </div>
          </form>
        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

</style>
