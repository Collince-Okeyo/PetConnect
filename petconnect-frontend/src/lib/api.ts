import axios from 'axios'

const baseURL = `${(import.meta.env.VITE_APP_URL || 'http://localhost:5000').replace(/\/$/, '')}/api`

export const api = axios.create({
  baseURL,
  withCredentials: true,
})

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}


