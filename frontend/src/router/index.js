import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'

const Login = () => import('@/views/auth/LoginUser.vue')
const Register = () => import('@/views/auth/RegisterUser.vue')
const Dashboard = () => import('@/views/DashboardProject.vue')

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: guestGuard,
    meta: {
      title: 'Login',
      layout: 'auth'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    beforeEnter: guestGuard,
    meta: {
      title: 'Register',
      layout: 'auth'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    beforeEnter: authGuard,
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Project Manager` : 'Project Manager'
  next()
})

export default router
