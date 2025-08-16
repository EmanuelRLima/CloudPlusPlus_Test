import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'

const Login = () => import('@/views/auth/LoginUser.vue')
const Register = () => import('@/views/auth/RegisterUser.vue')
const Dashboard = () => import('@/views/DashboardProject.vue')
const ProjectsList = () => import('@/views/projects/ProjectsList.vue')
const ProjectForm = () => import('@/views/projects/ProjectForm.vue')
const ProjectDetails = () => import('@/views/projects/ProjectDetails.vue')
const TasksList = () => import('@/views/projects/tasks/TasksList.vue')
const TaskForm = () => import('@/views/projects/tasks/TaskForm.vue')
const TaskDetails = () => import('@/views/projects/tasks/TaskDetails.vue')
const Profile = () => import('@/views/profile/UserProfile.vue')

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
    path: '/profile',
    name: 'profile',
    component: Profile,
    beforeEnter: authGuard
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    beforeEnter: authGuard,
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    },
  },
  {
    path: '/projects',
    name: 'projects.index',
    component: ProjectsList
  },
  {
    path: '/projects/create',
    name: 'projects.create',
    component: ProjectForm
  },
  {
    path: '/projects/:id',
    name: 'projects.show',
    component: ProjectDetails
  },
  {
    path: '/projects/:id/edit',
    name: 'projects.edit',
    component: ProjectForm
  },
  {
    path: '/projects/:projectId/tasks',
    name: 'tasks.index',
    component: TasksList
  },
  {
    path: '/projects/:projectId/tasks/create',
    name: 'tasks.create',
    component: TaskForm
  },
  {
    path: '/projects/:projectId/tasks/:taskId',
    name: 'tasks.show',
    component: TaskDetails
  },
  {
    path: '/projects/:projectId/tasks/:taskId/edit',
    name: 'tasks.edit',
    component: TaskForm
  }
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
