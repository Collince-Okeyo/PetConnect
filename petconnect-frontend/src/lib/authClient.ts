import { api } from './api'
import type { AuthResponse } from '../types/auth'

const AUTH = '/auth'

export async function register(payload: Record<string, unknown>) {
  const { data } = await api.post<AuthResponse>(`${AUTH}/register`, payload)
  return data
}

export async function login(payload: { email?: string; phone?: string; password: string }) {
  const { data } = await api.post<AuthResponse>(`${AUTH}/login`, payload)
  return data
}

export async function verifyOtp(payload: { userId: string; otp: string }) {
  const { data } = await api.post<AuthResponse>(`${AUTH}/verify`, payload)
  return data
}

export async function resendVerification(payload: { userId: string }) {
  const { data } = await api.post<AuthResponse>(`${AUTH}/resend-verification`, payload)
  return data
}

export async function me() {
  const { data } = await api.get<AuthResponse>(`${AUTH}/me`)
  return data
}

export async function refreshToken(payload: { refreshToken: string }) {
  const { data } = await api.post<AuthResponse>(`${AUTH}/refresh`, payload)
  return data
}

export async function logout(payload: { refreshToken: string }) {
  const { data } = await api.post<AuthResponse>(`${AUTH}/logout`, payload)
  return data
}

export async function googleLogin(accessToken: string) {
  const { data } = await api.post<AuthResponse>(`${AUTH}/google`, { accessToken })
  return data
}

export async function facebookLogin(accessToken: string) {
  const { data } = await api.post<AuthResponse>(`${AUTH}/facebook`, { accessToken })
  return data
}


