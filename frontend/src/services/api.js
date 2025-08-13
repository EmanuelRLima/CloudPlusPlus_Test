import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']

          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break

        case 403:
          console.error('Access forbidden:', data.message)
          break

        case 404:
          console.error('Resource not found:', data.message)
          break

        case 422:
          break

        case 429:
          console.error('Rate limit exceeded. Please try again later.')
          break

        case 500:
        case 502:
        case 503:
        case 504:
          console.error('Server error. Please try again later.')
          break

        default:
          console.error('An unexpected error occurred:', data.message)
      }
    } else if (error.request) {
      console.error('Network error. Please check your connection.')
    }

    return Promise.reject(error)
  }
)

export default api
