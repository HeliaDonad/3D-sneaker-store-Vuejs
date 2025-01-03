import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Dashboard from '../components/Dashboard.vue';
import PasswordChange from '../components/PasswordChange.vue';
import Bag from '../components/Bag.vue';
import Account from '../components/Account.vue';
import Orders from '../components/Orders.vue';
import Order from '../components/Order.vue';
import AdminDashboard from '../components/AdminDashboard.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/change-password', component: PasswordChange },
  { path: '/bag', component: Bag },
  { path: '/account', component: Account },
  { path: '/orders', component: Orders },
  { path: '/orders/:id', component: Order },
  { path: '/AdminDashboard', component: AdminDashboard },
  { path: '/', redirect: '/dashboard' } // Redirect root to dashboard
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/*router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (!isAuthenticated && to.path !== '/login' && to.path !== '/register' && to.path !== '/dashboard' && to.path !== '/bag') {
    next('/login'); // Redirect naar login als de gebruiker niet is ingelogd
  } else {
    next();
  }
});*/


export default router;