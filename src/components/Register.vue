<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  setup() {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const router = useRouter()

    const register = async () => {
      try {
    const response = await axios.post('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/register', {
        name: name.value,
        email: email.value,
        password: password.value,
    });
    console.log(response.data.message); // Log succesbericht
    error.value = ''; // Reset foutmeldingen
    router.push('/login'); // Verwijs naar de inlogpagina

} catch (err) {
  console.error('Error:', err);
  if (err.response) {
    error.value = err.response.data.message || "Registratie mislukt. Probeer opnieuw.";
  } else if (err.request) {
    error.value = "Geen antwoord van de server. Controleer je verbinding.";
  } else {
    error.value = "Er is een onverwachte fout opgetreden. Probeer opnieuw.";
  }
}

    }

    return {
      name,
      email,
      password,
      error,
      register
    }
  }
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="text-center text-3xl font-extrabold mb-4">Create a new account</h2>
        <p class="text-center text-sm mb-6">
          Or
          <router-link 
            to="/login" 
            class="link">
            I already have an account
          </router-link>
        </p>
      </div>
  
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="form-container bg-white py-8 px-6 shadow-lg rounded-lg">
          <form @submit.prevent="register">
            <div class="form-group mb-6 mt-4">
              <label for="name" class="label">Name</label>
              <input 
                id="name" 
                name="name" 
                placeholder="Your name" 
                type="text" 
                v-model="name" 
                required 
                class="input"
              />
            </div>
  
            <div class="form-group mb-6">
              <label for="email" class="label">Email address</label>
              <input 
                id="email" 
                name="email" 
                placeholder="user@example.com" 
                type="email" 
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
                v-model="password" 
                required 
                placeholder="Password"
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
              <button type="submit" class="submit-btn">Sign up</button>
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
  