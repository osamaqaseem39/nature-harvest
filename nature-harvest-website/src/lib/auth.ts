'use client'

// Simple, safe client-side token storage helpers

const TOKEN_STORAGE_KEY = 'authToken'

export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function getToken(): string | null {
  if (!isBrowser()) return null
  try {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    return token && token.trim().length > 0 ? token : null
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } catch {
    // no-op
  }
}

export function clearToken(): void {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    // no-op
  }
}

export const tokenStorageKey = TOKEN_STORAGE_KEY

