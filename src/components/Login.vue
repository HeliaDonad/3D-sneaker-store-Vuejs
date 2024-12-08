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
  router.push('/AdminDashboard'); // Correct: absoluut pad
} else {
  router.push('/Dashboard'); // Correct: absoluut pad
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
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-extrabold mb-4">Sign in to your account</h2>
      <p class="text-center text-sm mb-6">
        Or
        <router-link 
          to="/register" 
          class="link">
          create a new account
        </router-link>
      </p>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="form-container bg-white py-8 px-6 shadow-lg rounded-lg">
        <form @submit.prevent="login">
          <div class="form-group mb-6  mt-4">
            <label for="email" class="label">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="Email" 
              v-model="email" 
              required 
              class="input"
            />
          </div>

          <div class="form-group mb-6">
            <label for="password" class="label">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Password"
              v-model="password" 
              required 
              class="input"
            />
          </div>

          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <input 
                id="remember_me" 
                name="remember" 
                type="checkbox" 
                class="checkbox"
              />
              <label for="remember_me" class="ml-2 text-sm">Remember me</label>
            </div>
            <div>
              <a href="#" class="link">Forgot your password?</a>
            </div>
          </div>

          <div class="mb-4">
            <button type="submit" class="submit-btn">Sign in</button>
          </div>
        </form>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Algemene styling */
.min-h-screen {
  font-family: Helvetica, Arial, sans-serif;
  color: #000000;
}

/* Formulier container */
.form-container {
  background-color: #f3f3f3; /* Zachte achtergrondkleur */
  border: 2px solid #64f243;
  margin-top: 20px; /* Extra ruimte boven de container */
}

/* Labels */
.label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px; /* Extra ruimte onder de label */
  color: #333333;
}

/* Input velden */
.input {
  width: 100%;
  padding: 12px; /* Extra padding voor meer ruimte binnen het veld */
  border: 1px solid #cccccc;
  border-radius: 4px;
  margin-top: 0px; /* Ruimte tussen label en input */
  margin-bottom: 30px; /* Ruimte onder het veld */
  outline: none;
  transition: all 0.2s ease-in-out;
}

.input:focus {
  border-color: #64f243;
  box-shadow: 0 0 5px rgba(100, 242, 67, 0.5);
}

/* Checkbox */
.checkbox {
  width: 16px;
  height: 16px;
  border: 2px solid #cccccc;
  border-radius: 4px;
  background-color: #ffffff;
  margin-right: 5px; /* Ruimte rechts van de checkbox */
}

.checkbox:checked {
  background-color: #64f243;
  border-color: #64f243;
}

/* Link */
.link {
  color: #64f243;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

/* Submit knop */
.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #64f243;
  color: #000000;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  margin-bottom: 10px;
}

.submit-btn:hover {
  background-color: #63f243aa;
}

/* Error bericht */
.error-msg {
  margin-top: 20px;
  text-align: center;
  color: #ef4444; /* Rood voor fouten */
}

  /* Link stijl */
  .link {
  font-weight: 500; 
  color: #64f243; 
  text-decoration: underline; 
  transition: color 0.2s ease-in-out; 
}

.link:hover {
  color: #63d634; 
}
</style>
