import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Orders from '../components/Orders.vue';
import Order from '../components/Order.vue';
import PasswordChange from '../components/PasswordChange.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Orders },
  { path: '/orders/:id', component: Order },
  { path: '/change-password', component: PasswordChange },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
