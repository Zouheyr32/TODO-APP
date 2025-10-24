/**
 * Tasks Redux Slice
 * Contains all task-related state management and async thunks
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Types
export interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  is_deleted: boolean;
  modification_count: number;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  is_completed?: boolean;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  is_completed?: boolean;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  size: number;
}

export interface BulkDeleteRequest {
  task_ids: number[];
}

export interface TaskSearchParams {
  title?: string;
  is_completed?: boolean;
  page?: number;
  size?: number;
}

export interface TasksState {
  tasks: Task[];
  selectedTasks: number[];
  total: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  searchParams: TaskSearchParams;
}

// Initial state
const initialState: TasksState = {
  tasks: [],
  selectedTasks: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  searchParams: {
    page: 1,
    size: 10,
  },
};

// Async thunks (will be implemented when API service is ready)
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: { skip?: number; limit?: number } = {}) => {
    // This will be implemented when API service is ready
    throw new Error('API service not implemented yet');
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId: number) => {
    // This will be implemented when API service is ready
    throw new Error('API service not implemented yet');
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: TaskCreate) => {
    // This will be implemented when API service is ready
    throw new Error('API service not implemented yet');
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }: { id: number; taskData: TaskUpdate }) => {
    // This will be implemented when API service is ready
    throw new Error('API service not implemented yet');
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: number) => {
    // This will be implemented when API service is ready
    throw new Error('API service not implemented yet');
  }
);

export const bulkDeleteTasks = createAsyncThunk(
  'tasks/bulkDeleteTasks',
  async (taskIds: number[]) => {
    // This will be implemented when API service is ready
    throw new Error('API service not implemented yet');
  }
);

export const searchTasks = createAsyncThunk(
  'tasks/searchTasks',
  async (searchParams: TaskSearchParams) => {
    // This will be implemented when API service is ready
    throw new Error('API service not implemented yet');
  }
);

// Tasks slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set search parameters
    setSearchParams: (state, action: PayloadAction<TaskSearchParams>) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    
    // Set pagination
    setPagination: (state, action: PayloadAction<{ page: number; size: number }>) => {
      state.currentPage = action.payload.page;
      state.pageSize = action.payload.size;
    },
    
    // Task selection for bulk operations
    toggleTaskSelection: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      const index = state.selectedTasks.indexOf(taskId);
      if (index > -1) {
        state.selectedTasks.splice(index, 1);
      } else {
        state.selectedTasks.push(taskId);
      }
    },
    
    selectAllTasks: (state) => {
      state.selectedTasks = state.tasks.map(task => task.id);
    },
    
    clearSelection: (state) => {
      state.selectedTasks = [];
    },
    
    // Optimistic updates for better UX
    optimisticUpdateTask: (state, action: PayloadAction<{ id: number; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        Object.assign(task, updates);
      }
    },
    
    // Add task to list (for optimistic updates)
    addTaskToList: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
      state.total += 1;
    },
    
    // Remove task from list (for optimistic updates)
    removeTaskFromList: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter(task => task.id !== taskId);
      state.total = Math.max(0, state.total - 1);
    },
    
    // Update task in list (for optimistic updates)
    updateTaskInList: (state, action: PayloadAction<{ id: number; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        Object.assign(task, updates);
        task.modification_count += 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.size;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      });
    
    // Fetch task by ID
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.tasks.findIndex(task => task.id === action.payload.id);
        if (existingIndex > -1) {
          state.tasks[existingIndex] = action.payload;
        } else {
          state.tasks.push(action.payload);
        }
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch task';
      });
    
    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create task';
      });
    
    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index > -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task';
      });
    
    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        state.selectedTasks = state.selectedTasks.filter(id => id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete task';
      });
    
    // Bulk delete tasks
    builder
      .addCase(bulkDeleteTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteTasks.fulfilled, (state, action) => {
        state.loading = false;
        const deletedIds = action.payload;
        state.tasks = state.tasks.filter(task => !deletedIds.includes(task.id));
        state.total = Math.max(0, state.total - deletedIds.length);
        state.selectedTasks = [];
      })
      .addCase(bulkDeleteTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete tasks';
      });
    
    // Search tasks
    builder
      .addCase(searchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.size;
      })
      .addCase(searchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search tasks';
      });
  },
});

// Export actions
export const {
  clearError,
  setLoading,
  setSearchParams,
  setPagination,
  toggleTaskSelection,
  selectAllTasks,
  clearSelection,
  optimisticUpdateTask,
  addTaskToList,
  removeTaskFromList,
  updateTaskInList,
} = tasksSlice.actions;

// Selectors
export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectSelectedTasks = (state: RootState) => state.tasks.selectedTasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectTasksTotal = (state: RootState) => state.tasks.total;
export const selectTasksPagination = (state: RootState) => ({
  page: state.tasks.currentPage,
  size: state.tasks.pageSize,
});
export const selectTasksSearchParams = (state: RootState) => state.tasks.searchParams;

// Export reducer
export default tasksSlice.reducer;
