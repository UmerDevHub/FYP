import axios from 'axios';

// Base Axios instance for Node.js backend
export const nodeApi = axios.create({
  baseURL: import.meta.env.VITE_NODE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically to outgoing requests if available
nodeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Base Axios instance for FastAPI Python service
export const fastApi = axios.create({
  baseURL: import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
