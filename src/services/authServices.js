import axios from 'axios';
import { ref } from 'vue';

const currentUser = ref(null);

const getUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await axios.get('https://your-api-url.com/api/v1/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    currentUser.value = response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};

export { currentUser, getUser };
