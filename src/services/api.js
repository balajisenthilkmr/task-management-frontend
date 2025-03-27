import axios from 'axios';

const API_URL = 'https://task-management-backend-lkb3.onrender.com/api';

// Add a request interceptor to add the auth token to every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) =>
    axios.post(`${API_URL}/auth/login`, { email, password }),
  register: (name, email, password) =>
    axios.post(`${API_URL}/auth/signup`, { name, email, password }),
  getProfile: () => axios.get(`${API_URL}/auth/me`),
};

export const taskAPI = {
  getTasks: () => axios.get(`${API_URL}/tasks`),
  createTask: (title) => axios.post(`${API_URL}/tasks`, { title }),
  updateTask: (taskId, updates) =>
    axios.patch(`${API_URL}/tasks/${taskId}`, updates),
  deleteTask: (taskId) => axios.delete(`${API_URL}/tasks/${taskId}`),
}; 