import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { ref } from 'vue';

const currentUser = ref(null);

const getUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    currentUser.value = {
      id: decoded.id, // Of hoe je userId in de token staat
      name: decoded.name,
      email: decoded.email,
    };

    // Optioneel: Fetch meer gebruikersinformatie vanuit de backend
    const response = await axios.get(`https://your-api-url.com/api/v1/user/${decoded.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    currentUser.value = { ...currentUser.value, ...response.data };
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};

export { currentUser, getUser };
