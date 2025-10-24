/**
 * Services Index
 * Centralized exports for all API services
 */

// API Configuration
export { default as apiClient, api, healthCheck } from './api';
export type { ApiResponse, ApiError } from './api';

// Task Service
export { default as TaskService } from './taskService';
export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  bulkDeleteTasks,
  searchTasks,
  getCompletedTasks,
  getPendingTasks,
  restoreTask,
  toggleTaskCompletion,
  updateTaskTitle,
  updateTaskDescription,
} from './taskService';

// Metrics Service
export { default as MetricsService } from './metricsService';
export {
  getMetrics,
  getTaskStats,
  getCompletionTrends,
  getMostModifiedTasks,
  getProductivityMetrics,
  getCategoryBreakdown,
  getMetricsHealth,
  refreshMetrics,
  getDashboardData,
  getMetricsWithCache,
  clearMetricsCache,
} from './metricsService';

// Re-export types from store slices
export type { Task, TaskCreate, TaskUpdate, TaskListResponse, TaskSearchParams } from '@/store/slices/tasksSlice';
export type { Metrics, TaskStats } from '@/store/slices/metricsSlice';
