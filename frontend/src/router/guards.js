import { useAuthStore } from '@/stores/auth'

export async function authGuard(to, from, next) {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  if (!authStore.isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }

  next()
}

export async function guestGuard(to, from, next) {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  if (authStore.isAuthenticated) {
    const redirectTo = to.query.redirect || '/dashboard'
    next(redirectTo)
    return
  }

  next()
}

export async function adminGuard(to, from, next) {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.initializeAuth()
  }

  if (!authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }

  if (!authStore.user?.is_admin) {
    next({ name: 'dashboard' })
    return
  }

  next()
}
