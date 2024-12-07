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
    console.log('Verstuurde gegevens:', { email: email.value, password: password.value });

    const response = await axios.post(
      'https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/login',
      { email: email.value, password: password.value }
    );

    console.log('API-respons:', response.data);

    const { token } = response.data.data;
    localStorage.setItem('token', token); // Token opslaan in localStorage

    // Decode de JWT-token om de rol te controleren
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode de payload
    const isAdmin = decodedToken.isAdmin; // Controleer of de gebruiker een admin is

    if (isAdmin) {
      router.push('/AdminDashboard'); // Admin wordt doorgestuurd naar adminDashboard
    } else {
      router.push('/Dashboard'); // Normale gebruiker wordt doorgestuurd naar dashboard
    }
  } catch (err) {
    console.error('Login fout:', err.response?.data || err.message);
    error.value = err.response?.data?.message || 'Login failed. Please try again.';
  }
};

    return {
      email,
      password,
      error,
      login
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-6">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm leading-5 text-blue-500 max-w">
            Or
            <router-link to="/register"
                class="font-medium text-blue-500 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                create a new account
            </router-link>
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form @submit.prevent="login">
                <div>
                    <label for="email" class="block text-sm font-medium leading-5 text-gray-700">Email</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input id="email" name="email" placeholder="Email" type="email" required v-model="email" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                    </div>
                </div>

                <div class="mt-6">
                    <label for="password" class="block text-sm font-medium leading-5 text-gray-700">Password</label>
                    <div class="mt-1 rounded-md shadow-sm">
                        <input id="password" name="password" type="password" required v-model="password" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                    </div>
                </div>

                <div class="mt-6 flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember_me" name="remember" type="checkbox" value="1" class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out">
                        <label for="remember_me" class="ml-2 block text-sm leading-5 text-gray-900">Remember me</label>
                    </div>

                    <div class="text-sm leading-5">
                        <a href="#"
                            class="font-medium text-blue-500 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <div class="mt-6">
                    <span class="block w-full rounded-md shadow-sm">
                        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                            Sign in
                        </button>
                    </span>
                </div>
            </form>
            <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
        </div>
    </div>
  </div>
</template>

<style scoped>
/* Voeg TailwindCSS klassen toe voor styling */
</style>