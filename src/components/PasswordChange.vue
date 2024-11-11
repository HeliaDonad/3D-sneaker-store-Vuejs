<template>
  <div class="password-change">
    <h1>Change Password</h1>
    <form @submit.prevent="changePassword">
      <input type="password" v-model="oldPassword" placeholder="Old Password" required />
      <input type="password" v-model="newPassword" placeholder="New Password" required />
      <button type="submit">Update Password</button>
    </form>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="error" class="error-message">{{ error }}</p>
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
      successMessage: null,
    };
  },
  methods: {
    async changePassword() {
      this.error = null; // Reset error message
      this.successMessage = null; // Reset success message
      try {
        const response = await axios.put(
          'https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1/change-password',
          {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (response.status === 200) {
          this.successMessage = "Password updated successfully";
          this.oldPassword = '';
          this.newPassword = '';
        } else {
          this.error = "Password change failed. Please try again.";
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          this.error = error.response.data.message;
        } else {
          this.error = "Password change failed. Please try again.";
        }
      }
    },
  },
};
</script>

<style scoped>
.success-message {
  color: green;
}
.error-message {
  color: red;
}
</style>
