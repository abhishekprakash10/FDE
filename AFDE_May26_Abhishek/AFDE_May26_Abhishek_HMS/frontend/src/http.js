import axios from 'axios'

const http = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: inject role header
http.interceptors.request.use(
  (config) => {
    const role = sessionStorage.getItem('sd_role')
    config.headers['X-Role'] = role === 'it_admin' ? 'support_admin' : 'employee'
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: normalize errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error?.response?.data?.detail ||
      error?.message ||
      'An unexpected error occurred.'
    return Promise.reject(new Error(msg))
  }
)

export default http
