import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Dashboard from '../components/Dashboard.vue';
import PasswordChange from '../components/PasswordChange.vue';
import Bag from '../components/Bag.vue';
import Account from '../components/Account.vue';
import Orders from '../components/Orders.vue';
import Order from '../components/Order.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/change-password', component: PasswordChange },
  { path: '/bag', component: Bag },
  { path: '/account', component: Account },
  { path: '/orders', component: Orders },
  { path: '/orders/:id', component: Order },
  { path: '/', redirect: '/dashboard' } // Redirect root to dashboard
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;