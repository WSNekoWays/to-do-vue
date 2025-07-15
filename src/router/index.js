import { createRouter, createWebHistory } from 'vue-router'
import TodoView from '@/views/TodoView.vue' // JANGAN pakai @ dulu

const routes = [
  { path: '/', component: TodoView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router