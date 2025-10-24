/**
 * API Configuration and Base Axios Instance
 * Centralized API configuration for backend communication
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('🔒 Unauthorized access');
          localStorage.removeItem('auth_token');
          // You can dispatch a logout action here
          break;
        case 403:
          console.error('🚫 Forbidden access');
          break;
        case 404:
          console.error('🔍 Resource not found');
          break;
        case 500:
          console.error('💥 Server error');
          break;
        default:
          console.error(`❌ API Error ${status}:`, data);
      }
    } else if (error.request) {
      // Network error
      console.error('🌐 Network Error:', error.message);
    } else {
      // Other error
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  error: string;
  detail?: string;
  status_code: number;
}

// Generic API methods
export const api = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.get(url, config).then(response => ({
      data: response.data,
      status: response.status,
    })),
  
  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.post(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
    })),
  
  // PUT request
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.put(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
    })),
  
  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.patch(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
    })),
  
  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.delete(url, config).then(response => ({
      data: response.data,
      status: response.status,
    })),
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Export the configured axios instance
export default apiClient;
