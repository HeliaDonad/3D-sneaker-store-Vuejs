import axios from 'axios';

// Base API URL
const API_URL = 'https://threed-sneaker-store-seda-ezzat-helia.onrender.com/api/v1';

// Login gebruiker
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    const token = response.data.data.token;

    // Decode JWT om userId op te halen
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.userId;

    // Sla token en userId op in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);

    return { token, userId };
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Login failed.');
  }
};

// Haal huidige gebruiker op
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch user:', error.response?.data?.message || error.message);
    return null;
  }
};

// Controleer of gebruiker is ingelogd
export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Uitloggen
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};
