<template>
    <div class="login">
      <h1>Admin Login</h1>
      <form @submit.prevent="login">
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: null,
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/login', {
            username: this.username,
            password: this.password,
          });
          localStorage.setItem('token', response.data.token);
          this.$router.push('/dashboard');
        } catch (error) {
          this.error = "Login failed. Please try again.";
        }
      },
    },
  };
  </script>
  