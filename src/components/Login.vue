<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const router = useRouter()

    const login = async () => {
      try {
        const response = await axios.post('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/login', {
          email: email.value,
          password: password.value,
        })

        const token = response.data.data.token

        if (email.value === 'admin@admin.com' && password.value === 'Admin') {
          localStorage.setItem('token', token) // Save token
          router.push('/dashboard') // Navigate to dashboard
        } else {
          error.value = 'Invalid admin credentials'
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Login failed. Please try again.'
      }
    }

    return {
      email,
      password,
      error,
      login,
    }
  },
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-6">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
        Admin Login
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="login">
          <div>
            <label for="email" class="block text-sm font-medium leading-5 text-gray-700">Email</label>
            <div class="mt-1 rounded-md shadow-sm">
              <input
                id="email"
                type="email"
                v-model="email"
                class="appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div class="mt-6">
            <label for="password" class="block text-sm font-medium leading-5 text-gray-700">Password</label>
            <div class="mt-1 rounded-md shadow-sm">
              <input
                id="password"
                type="password"
                v-model="password"
                class="appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div class="mt-6">
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border rounded-md text-white bg-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styling via TailwindCSS */
</style>
