import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard } from './guards'

const Login = () => import('@/views/auth/LoginUser.vue')
const Register = () => import('@/views/auth/RegisterUser.vue')
const Dashboard = () => import('@/views/DashboardProject.vue')
/* const Projects = () => import('@/views/projects/ProjectList.vue')
const ProjectCreate = () => import('@/views/projects/ProjectCreate.vue')
const ProjectEdit = () => import('@/views/projects/ProjectEdit.vue')
const ProjectDetail = () => import('@/views/projects/ProjectDetail.vue')
const TaskCreate = () => import('@/views/tasks/TaskCreate.vue')
const TaskEdit = () => import('@/views/tasks/TaskEdit.vue')
const Profile = () => import('@/views/Profile.vue')
const NotFound = () => import('@/views/NotFound.vue') */

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
  /* {
    path: '/projects',
    name: 'projects',
    component: Projects,
    beforeEnter: authGuard,
    meta: {
      title: 'Projects',
      requiresAuth: true
    }
  },
  {
    path: '/projects/create',
    name: 'project-create',
    component: ProjectCreate,
    beforeEnter: authGuard,
    meta: {
      title: 'Create Project',
      requiresAuth: true
    }
  },
  {
    path: '/projects/:id/edit',
    name: 'project-edit',
    component: ProjectEdit,
    beforeEnter: authGuard,
    props: true,
    meta: {
      title: 'Edit Project',
      requiresAuth: true
    }
  },
  {
    path: '/projects/:id',
    name: 'project-detail',
    component: ProjectDetail,
    beforeEnter: authGuard,
    props: true,
    meta: {
      title: 'Project Details',
      requiresAuth: true
    }
  },
  {
    path: '/projects/:projectId/tasks/create',
    name: 'task-create',
    component: TaskCreate,
    beforeEnter: authGuard,
    props: true,
    meta: {
      title: 'Create Task',
      requiresAuth: true
    }
  },
  {
    path: '/tasks/:id/edit',
    name: 'task-edit',
    component: TaskEdit,
    beforeEnter: authGuard,
    props: true,
    meta: {
      title: 'Edit Task',
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    beforeEnter: authGuard,
    meta: {
      title: 'Profile',
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { title: 'Page Not Found' }
  } */
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

// Global navigation guard for title updates
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Project Manager` : 'Project Manager'
  next()
})

export default router
