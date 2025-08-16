import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import router from '@/router/index'
import api from '@/services/api'

vi.mock('vue3-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

vi.mock('@/router/index', () => ({
  default: {
    push: vi.fn()
  }
}))

vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}))

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useAuthStore', () => {
  let authStore

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Initial State', () => {
    it('should have the correct initial state', () => {
      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(undefined)
      expect(authStore.isLoading).toBe(false)
      expect(authStore.isInitialized).toBe(false)
      expect(authStore.isAuthenticated).toBe(false)
    })

    it('should load token from localStorage on initialization', () => {
      const mockToken = 'mock-token'
      localStorageMock.getItem.mockReturnValue(mockToken)

      setActivePinia(createPinia())
      const newStore = useAuthStore()
      expect(newStore.token).toBe(mockToken)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('token')
    })
  })

  describe('Computed Properties', () => {
    it('isAuthenticated should return true when both token and user are present', () => {
      authStore.token = 'test-token'
      authStore.user = { id: 1, name: 'Test User' }

      expect(authStore.isAuthenticated).toBe(true)
    })

    it('isAuthenticated should return false when token or user are missing', () => {
      authStore.token = 'test-token'
      authStore.user = null
      expect(authStore.isAuthenticated).toBe(false)

      authStore.token = null
      authStore.user = { id: 1, name: 'Test User' }
      expect(authStore.isAuthenticated).toBe(false)
    })
  })

  describe('setPendingMessage', () => {
    it('should set pending message with default success type', () => {
      authStore.setPendingMessage('Test message')

      expect(authStore.pendingMessage).toEqual({
        message: 'Test message',
        type: 'success'
      })
    })

    it('should set pending message with custom type', () => {
      authStore.setPendingMessage('Error message', 'error')

      expect(authStore.pendingMessage).toEqual({
        message: 'Error message',
        type: 'error'
      })
    })
  })

  describe('showPendingMessage', () => {
    it('should show pending message and clear it', () => {
      authStore.pendingMessage = { message: 'Test message', type: 'success' }

      authStore.showPendingMessage()

      expect(toast.success).toHaveBeenCalledWith('Test message')
      expect(authStore.pendingMessage).toBe(null)
    })

    it('should do nothing if there is no pending message', () => {
      authStore.pendingMessage = null

      authStore.showPendingMessage()

      expect(toast.success).not.toHaveBeenCalled()
      expect(toast.error).not.toHaveBeenCalled()
    })
  })

  describe('initializeAuth', () => {
    it('should initialize successfully when valid token exists', async () => {
      const mockUser = { id: 1, name: 'Test User' }
      authStore.token = 'valid-token'
      api.get.mockResolvedValue({ data: mockUser })

      await authStore.initializeAuth()

      expect(api.defaults.headers.common['Authorization']).toBe('Bearer valid-token')
      expect(api.get).toHaveBeenCalledWith('/user')
      expect(authStore.user).toEqual(mockUser)
      expect(authStore.isInitialized).toBe(true)
      expect(authStore.isLoading).toBe(false)
    })

    it('should not initialize again if already initialized', async () => {
      authStore.isInitialized = true

      await authStore.initializeAuth()

      expect(api.get).not.toHaveBeenCalled()
    })

    it('should skip validation if there is no token', async () => {
      authStore.token = null

      await authStore.initializeAuth()

      expect(api.get).not.toHaveBeenCalled()
      expect(authStore.isInitialized).toBe(true)
      expect(authStore.isLoading).toBe(false)
    })
  })

  describe('login', () => {
    it('should login successfully', async () => {
      const credentials = { login: 'test@example.com', password: 'password' }
      const mockResponse = {
        data: {
          user: { id: 1, name: 'Test User' },
          token: 'new-token'
        }
      }

      api.post.mockResolvedValue(mockResponse)

      const result = await authStore.login(credentials)

      expect(api.post).toHaveBeenCalledWith('/v1/login', credentials)
      expect(authStore.user).toEqual(mockResponse.data.user)
      expect(authStore.token).toBe('new-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'new-token')
      expect(api.defaults.headers.common['Authorization']).toBe('Bearer new-token')
      expect(result).toEqual({ success: true })
      expect(authStore.isLoading).toBe(false)
    })

    it('should handle login error', async () => {
      const credentials = { login: 'test@example.com', password: 'wrongpassword' }
      const mockError = {
        response: {
          data: {
            message: 'Invalid credentials',
            errors: { login: ['Invalid email or password'] }
          }
        }
      }

      api.post.mockRejectedValue(mockError)

      const result = await authStore.login(credentials)

      expect(toast.error).toHaveBeenCalledWith('Invalid credentials')
      expect(result).toEqual({
        success: false,
        errors: { login: ['Invalid email or password'] }
      })
      expect(authStore.isLoading).toBe(false)
    })

  })

  describe('register', () => {
    it('should register successfully', async () => {
      const userData = new FormData()
      userData.append('name', 'Test User')

      api.post.mockResolvedValue({})

      const result = await authStore.register(userData)

      expect(api.post).toHaveBeenCalledWith('/v1/register', userData)
      expect(authStore.pendingMessage).toEqual({
        message: "Registration successful! Now you can log in.",
        type: 'success'
      })
      expect(router.push).toHaveBeenCalledWith('/login?registered=true')
      expect(result).toEqual({ success: true })
      expect(authStore.isLoading).toBe(false)
    })

    it('should handle registration error', async () => {
      const userData = new FormData()
      const mockError = {
        response: {
          data: {
            message: 'Validation failed',
            errors: { email: ['Email already exists'] }
          }
        }
      }

      api.post.mockRejectedValue(mockError)

      const result = await authStore.register(userData)

      expect(toast.error).toHaveBeenCalledWith('Validation failed')
      expect(result).toEqual({
        success: false,
        errors: { email: ['Email already exists'] }
      })
      expect(authStore.isLoading).toBe(false)
    })

    it('should handle error without specific response during registration', async () => {
      const userData = new FormData()
      api.post.mockRejectedValue(new Error('Network error'))

      const result = await authStore.register(userData)

      expect(toast.error).toHaveBeenCalledWith('Registration failed')
      expect(result).toEqual({
        success: false,
        errors: {}
      })
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      authStore.token = 'test-token'
      authStore.user = { id: 1, name: 'Test User' }
      api.defaults.headers.common['Authorization'] = 'Bearer test-token'

      api.post.mockResolvedValue({})

      await authStore.logout()

      expect(api.post).toHaveBeenCalledWith('/v1/logout')
      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(api.defaults.headers.common['Authorization']).toBeUndefined()
      expect(authStore.isLoading).toBe(false)
    })
  })

  describe('Loading States', () => {
    it('should set isLoading during operations', async () => {
      api.post.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100))
      )

      const loginPromise = authStore.login({ login: 'test', password: 'test' })
      expect(authStore.isLoading).toBe(true)

      await loginPromise
      expect(authStore.isLoading).toBe(false)
    })
  })


})
