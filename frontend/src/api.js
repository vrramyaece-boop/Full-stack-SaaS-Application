import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setAuthToken(token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`
}

export function clearAuthToken() {
  delete api.defaults.headers.common.Authorization
}

export async function login(email, password) {
  const payload = new URLSearchParams({ username: email, password }).toString()
  return api.post('/auth/login', payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

export async function register(email, password) {
  return api.post('/auth/register', { email, password })
}

export async function getCurrentUser() {
  return api.get('/auth/me')
}

export async function getProjects() {
  return api.get('/projects')
}

export async function createProject(name, description) {
  return api.post('/projects', { name, description })
}

export async function deleteProject(projectId) {
  return api.delete(`/projects/${projectId}`)
}

export async function getSubscription() {
  return api.get('/subscriptions/my-subscription')
}

export async function createCheckoutSession() {
  return api.post('/subscriptions/create-checkout-session')
}

export async function getUsers() {
  return api.get('/admin/users')
}

export async function getSubscriptions() {
  return api.get('/admin/subscriptions')
}

export default api
