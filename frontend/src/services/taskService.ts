/**
 * Task Service
 * API service for all task-related operations
 */

import { api, ApiResponse } from './api';
import { Task, TaskCreate, TaskUpdate, TaskListResponse, TaskSearchParams } from '@/store/slices/tasksSlice';

// Task API endpoints
const TASK_ENDPOINTS = {
  TASKS: '/tasks',
  SEARCH: '/tasks/search',
  BULK_DELETE: '/tasks/bulk',
  COMPLETED: '/tasks/completed/list',
  PENDING: '/tasks/pending/list',
} as const;

// Task Service Class
export class TaskService {
  /**
   * Get all tasks with pagination
   */
  static async getTasks(params: { skip?: number; limit?: number } = {}): Promise<TaskListResponse> {
    const { skip = 0, limit = 100 } = params;
    const response = await api.get<TaskListResponse>(
      `${TASK_ENDPOINTS.TASKS}/?skip=${skip}&limit=${limit}`
    );
    return response.data;
  }

  /**
   * Get a specific task by ID
   */
  static async getTaskById(taskId: number): Promise<Task> {
    const response = await api.get<Task>(`${TASK_ENDPOINTS.TASKS}/${taskId}`);
    return response.data;
  }

  /**
   * Create a new task
   */
  static async createTask(taskData: TaskCreate): Promise<Task> {
    const response = await api.post<Task>(TASK_ENDPOINTS.TASKS, taskData);
    return response.data;
  }

  /**
   * Update an existing task
   */
  static async updateTask(taskId: number, taskData: TaskUpdate): Promise<Task> {
    const response = await api.put<Task>(`${TASK_ENDPOINTS.TASKS}/${taskId}`, taskData);
    return response.data;
  }

  /**
   * Delete a task (soft delete)
   */
  static async deleteTask(taskId: number): Promise<void> {
    await api.delete(`${TASK_ENDPOINTS.TASKS}/${taskId}`);
  }

  /**
   * Bulk delete multiple tasks
   */
  static async bulkDeleteTasks(taskIds: number[]): Promise<{ deleted_count: number; message: string }> {
    const response = await api.delete<{ deleted_count: number; message: string }>(
      TASK_ENDPOINTS.BULK_DELETE,
      { data: { task_ids: taskIds } }
    );
    return response.data;
  }

  /**
   * Search and filter tasks
   */
  static async searchTasks(searchParams: TaskSearchParams): Promise<TaskListResponse> {
    const queryParams = new URLSearchParams();
    
    if (searchParams.title) queryParams.append('title', searchParams.title);
    if (searchParams.is_completed !== undefined) queryParams.append('is_completed', searchParams.is_completed.toString());
    if (searchParams.page) queryParams.append('page', searchParams.page.toString());
    if (searchParams.size) queryParams.append('size', searchParams.size.toString());

    const response = await api.get<TaskListResponse>(
      `${TASK_ENDPOINTS.SEARCH}?${queryParams.toString()}`
    );
    return response.data;
  }

  /**
   * Get completed tasks
   */
  static async getCompletedTasks(params: { skip?: number; limit?: number } = {}): Promise<Task[]> {
    const { skip = 0, limit = 100 } = params;
    const response = await api.get<Task[]>(
      `${TASK_ENDPOINTS.COMPLETED}?skip=${skip}&limit=${limit}`
    );
    return response.data;
  }

  /**
   * Get pending tasks
   */
  static async getPendingTasks(params: { skip?: number; limit?: number } = {}): Promise<Task[]> {
    const { skip = 0, limit = 100 } = params;
    const response = await api.get<Task[]>(
      `${TASK_ENDPOINTS.PENDING}?skip=${skip}&limit=${limit}`
    );
    return response.data;
  }

  /**
   * Restore a deleted task
   */
  static async restoreTask(taskId: number): Promise<Task> {
    const response = await api.post<Task>(`${TASK_ENDPOINTS.TASKS}/${taskId}/restore`);
    return response.data;
  }

  /**
   * Toggle task completion status
   */
  static async toggleTaskCompletion(taskId: number, isCompleted: boolean): Promise<Task> {
    return this.updateTask(taskId, { is_completed: isCompleted });
  }

  /**
   * Update task title
   */
  static async updateTaskTitle(taskId: number, title: string): Promise<Task> {
    return this.updateTask(taskId, { title });
  }

  /**
   * Update task description
   */
  static async updateTaskDescription(taskId: number, description: string): Promise<Task> {
    return this.updateTask(taskId, { description });
  }
}

// Export individual functions for convenience
export const {
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
} = TaskService;

// Export the service class as default
export default TaskService;
