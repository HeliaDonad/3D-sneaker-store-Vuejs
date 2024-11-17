import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// Functie om een gebruiker in te loggen
const loginUser = async (email, password) => {
  try {
    const response = await axios.post('https://your-api-url.com/api/v1/login', { email, password });
    const token = response.data.data.token;
    localStorage.setItem('token', token); // Sla het token op
    router.push('/dashboard'); // Navigeer naar het dashboard
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw new Error('Login failed');
  }
};

// Functie om een gebruiker uit te loggen
const logoutUser = () => {
  localStorage.removeItem('token'); // Verwijder het token
  router.push('/login'); // Navigeer naar de loginpagina
};

// Functie om de huidige gebruiker op te halen
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  try {
    const response = await axios.get('https://your-api-url.com/api/v1/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data; // Retourneer de gebruikersgegevens
  } catch (error) {
    console.error('Failed to fetch current user:', error.message);
    return null;
  }
};

export { loginUser, logoutUser, getCurrentUser };
