import { mockApiFetch } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_MODE = import.meta.env.VITE_API_MODE || 'mock';

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export function getAuthToken() {
  return localStorage.getItem('authToken');
}

export function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function apiFetch(path, options = {}) {
  const { auth = false, headers = {}, ...fetchOptions } = options;

  if (API_MODE === 'mock') {
    return mockApiFetch(path, { auth, headers, ...fetchOptions });
  }

  return fetch(apiUrl(path), {
    ...fetchOptions,
    headers: {
      ...headers,
      ...(auth ? authHeaders() : {}),
    },
  });
}
