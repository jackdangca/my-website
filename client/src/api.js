const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {})
  headers.set('Accept', 'application/json')

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new Error('Unable to connect to the server. Please try again later.')
  }

  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(result.message || result.errors?.join(', ') || 'The request could not be completed.')
  }
  return result
}

export const api = {
  get: (path, token) => apiRequest(path, { token }),
  post: (path, body, token) =>
    apiRequest(path, { method: 'POST', body: JSON.stringify(body), token }),
  put: (path, body, token) =>
    apiRequest(path, { method: 'PUT', body: JSON.stringify(body), token }),
  delete: (path, token) => apiRequest(path, { method: 'DELETE', token }),
}
