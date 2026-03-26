const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const err = new Error(data.message || 'API Error');
    err.status = response.status;
    throw err;
  }
  return data;
}

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: token ? `Bearer ${token}` : '',
});

export const signup = (data) => fetch(`${baseUrl}/auth/signup`, {
  method: 'POST',
  headers: authHeaders(),
  body: JSON.stringify(data),
}).then(handleResponse);

export const login = (data) => fetch(`${baseUrl}/auth/login`, {
  method: 'POST',
  headers: authHeaders(),
  body: JSON.stringify(data),
}).then(handleResponse);

export const getTasks = (token, filters = {}) => {
  const url = new URL(`${baseUrl}/tasks`);
  Object.entries(filters).forEach(([key, value]) => { if (value) url.searchParams.set(key, value); });
  return fetch(url.toString(), { headers: authHeaders(token) }).then(handleResponse);
};

export const createTask = (token, data) => fetch(`${baseUrl}/tasks`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(data) }).then(handleResponse);

export const updateTask = (token, id, data) => fetch(`${baseUrl}/tasks/${id}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(data) }).then(handleResponse);

export const deleteTask = (token, id) => fetch(`${baseUrl}/tasks/${id}`, { method: 'DELETE', headers: authHeaders(token) }).then(handleResponse);
