import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import router from '../router/index'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const isLoading = ref(false)
  const isInitialized = ref(false)
  const pendingMessage = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

   function setPendingMessage(message, type = 'success') {
    pendingMessage.value = { message, type }
  }

  function showPendingMessage() {
    if (pendingMessage.value) {
      const { message, type } = pendingMessage.value
      toast[type](message)
      pendingMessage.value = null
    }
  }

  async function initializeAuth() {
    if (isInitialized.value) return

    isLoading.value = true

    try {
      if (token.value) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

        const response = await api.get('/user')
        user.value = response.data
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      await logout()
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  async function login(credentials) {
    isLoading.value = true

    try {
      const response = await api.post('/v1/login', credentials)
      const { user: userData, token: userToken } = response.data
      token.value = userToken
      user.value = userData

      localStorage.setItem('token', userToken)

      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message);

      return {
        success: false,
        errors: error.response?.data?.errors || {}
      }
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData) {
    isLoading.value = true

    try {
      await api.post('/v1/register', userData)
      setPendingMessage("Registration successful! Now you can log in.", 'success')
      router.push('/login?registered=true')

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message);

      return {
        success: false,
        errors: error.response?.data?.errors || {}
      }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true

    try {
      if (token.value) {
        await api.post('/v1/logout')
      }
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      user.value = null
      token.value = null

      localStorage.removeItem('token')

      delete api.defaults.headers.common['Authorization']

      isLoading.value = false
    }
  }

  return {
    user,
    token,
    isLoading,
    isInitialized,

    isAuthenticated,

    showPendingMessage,
    initializeAuth,
    login,
    register,
    logout,
  }
})
