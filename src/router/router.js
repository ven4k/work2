import { createRouter, createWebHistory } from 'vue-router'
import MainMenu from '../components/MainMenu/MainMenu.vue'
import Login from '../components/Login/Login.vue'
import NotFound from '../components/NotFound/NotFound.vue'


const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/main-menu', name: 'MainMenu', component: MainMenu },
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router