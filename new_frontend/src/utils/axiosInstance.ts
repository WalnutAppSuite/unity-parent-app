import axios, { AxiosError } from 'axios';
import { basePath } from '@/constants/index';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL : basePath,
  // baseURL: 'https://api.example.com',
  // Add other default configs if needed
});

// Response interceptor to handle 403 errors globally
axiosInstance.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 403) {
      // Centralized 403 handling logic
      // For example, redirect to login or show a message
      // window.location.href = '/login';
      // Or use a notification system
      console.error('Access denied (403)');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
