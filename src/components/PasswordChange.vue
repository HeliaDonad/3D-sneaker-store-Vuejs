<template>
    <div class="password-change">
      <h1>Change Password</h1>
      <form @submit.prevent="changePassword">
        <input type="password" v-model="oldPassword" placeholder="Old Password" required />
        <input type="password" v-model="newPassword" placeholder="New Password" required />
        <button type="submit">Update Password</button>
      </form>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        oldPassword: '',
        newPassword: '',
        error: null,
      };
    },
    methods: {
      async changePassword() {
        try {
          await axios.patch('https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/password', {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          alert("Password updated successfully");
        } catch (error) {
          this.error = "Password change failed. Please try again.";
        }
      },
    },
  };
  </script>
  