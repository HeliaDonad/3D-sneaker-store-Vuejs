import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import Orders from '../components/Orders.vue'
/*import ChangePassword from '../views/ChangePassword.vue'*/

const routes = [
  { path: '/', component: App },
  { path: '/orders', component: Orders },
  /*{ path: '/change-password', component: ChangePassword },*/
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router