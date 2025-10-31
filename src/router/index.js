import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Quiz from '../views/Quiz.vue'
import Result from '../views/Result.vue'
import History from '../views/History.vue'
import MatchTwo from '../views/MatchTwo.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/quiz', component: Quiz, meta: { requiresAuth: true } },
  { path: '/result/:id', name: 'result', component: Result, meta: { requiresAuth: true } },
  { path: '/history', component: History, meta: { requiresAuth: true } },
  { path: '/match', component: MatchTwo, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(r => r.meta && r.meta.requiresAuth)
  const user = JSON.parse(localStorage.getItem('mm_user') || 'null')
  const loggedIn = user && user.loggedIn
  if (requiresAuth && !loggedIn) {
    return next({ path: '/login' })
  }
  next()
})

export default router
