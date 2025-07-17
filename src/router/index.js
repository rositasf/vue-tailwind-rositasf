import { createRouter, createWebHistory } from 'vue-router'
import Ideas from '../views/Ideas.vue'

const routes = [
  { path: '/', name: 'Ideas', component: Ideas }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
