import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Index from '@/views/index.vue'
import About from '@/views/about.vue'
import Contact from '@/views/contact.vue'

const routes: Array<RouteRecordRaw>
  = [
    { path: '/', component: Index },
    { path: '/about', component: About },
    { path: '/contact', component: Contact }
  ]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
