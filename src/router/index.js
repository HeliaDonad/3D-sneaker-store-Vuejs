import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Orders from '../components/Orders.vue';
import Order from '../components/Order.vue';
import Dashboard from '../components/Dashboard.vue';
import PasswordChange from '../components/PasswordChange.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/orders', component: Orders },
  { path: '/order/:id', component: Order },
  { path: '/dashboard', component: Dashboard },
  { path: '/change-password', component: PasswordChange },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
