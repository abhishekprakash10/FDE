/**
 * http.js — Axios instance for PulseCheck API
 * Automatically attaches X-Role header from sessionStorage on every request.
 */

import axios from 'axios'

const http = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: inject X-Role header when a role is stored
http.interceptors.request.use((config) => {
  const role = sessionStorage.getItem('pc_role')
  if (role) {
    config.headers['X-Role'] = role
  }
  return config
})

export default http
