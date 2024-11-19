import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Dashboard from '../components/Dashboard.vue';
import GuestDashboard from '../components/GuestDashboard.vue';
import PasswordChange from '../components/PasswordChange.vue';
import Bag from '../components/Bag.vue';
import Account from '../components/Account.vue';
import Orders from '../components/Orders.vue';
import Order from '../components/Order.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/change-password', component: PasswordChange },
  { path: '/bag', component: Bag },
  { path: '/account', component: Account },
  { path: '/orders', component: Orders },
  { path: '/orders/:id', component: Order },
  { path: '/', redirect: '/dashboard' }, // Redirect root to dashboard
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const isLoggedIn = !!localStorage.getItem('token');
      if (isLoggedIn) {
        next(); // Ga naar het echte Dashboard
      } else {
        next('/guest-dashboard'); // Stuur naar GuestDashboard
      }
    },
  },
  {
    path: '/guest-dashboard',
    component: GuestDashboard,
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }, // Fallback voor niet-bestaande routes
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Globale guard (indien nodig)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (!isAuthenticated && to.meta.requiresAuth) {
    next('/login'); // Redirect naar login als de gebruiker niet is ingelogd
  } else {
    next();
  }
});

export default router;
