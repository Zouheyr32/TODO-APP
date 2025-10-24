/**
 * Custom Hooks for Task Operations
 * Convenient hooks for using task-related Redux actions and state
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
  bulkDeleteTasks,
  searchTasks,
  clearError,
  setSearchParams,
  setPagination,
  toggleTaskSelection,
  selectAllTasks,
  clearSelection,
  optimisticUpdateTask,
} from '@/store/slices/tasksSlice';
import {
  selectTasks,
  selectSelectedTasks,
  selectTasksLoading,
  selectTasksError,
  selectTasksTotal,
  selectTasksPagination,
  selectTasksSearchParams,
} from '@/store/slices/tasksSlice';

// Main tasks hook
export const useTasks = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const tasks = useAppSelector(selectTasks);
  const selectedTasks = useAppSelector(selectSelectedTasks);
  const loading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);
  const total = useAppSelector(selectTasksTotal);
  const pagination = useAppSelector(selectTasksPagination);
  const searchParams = useAppSelector(selectTasksSearchParams);

  // Actions
  const loadTasks = useCallback((params?: { skip?: number; limit?: number }) => {
    dispatch(fetchTasks(params));
  }, [dispatch]);

  const loadTaskById = useCallback((taskId: number) => {
    dispatch(fetchTaskById(taskId));
  }, [dispatch]);

  const addTask = useCallback((taskData: any) => {
    dispatch(createTask(taskData));
  }, [dispatch]);

  const editTask = useCallback((id: number, taskData: any) => {
    dispatch(updateTask({ id, taskData }));
  }, [dispatch]);

  const removeTask = useCallback((taskId: number) => {
    dispatch(deleteTask(taskId));
  }, [dispatch]);

  const removeMultipleTasks = useCallback((taskIds: number[]) => {
    dispatch(bulkDeleteTasks(taskIds));
  }, [dispatch]);

  const searchTasksAction = useCallback((params: any) => {
    dispatch(searchTasks(params));
  }, [dispatch]);

  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateSearchParams = useCallback((params: any) => {
    dispatch(setSearchParams(params));
  }, [dispatch]);

  const updatePagination = useCallback((page: number, size: number) => {
    dispatch(setPagination({ page, size }));
  }, [dispatch]);

  const toggleSelection = useCallback((taskId: number) => {
    dispatch(toggleTaskSelection(taskId));
  }, [dispatch]);

  const selectAll = useCallback(() => {
    dispatch(selectAllTasks());
  }, [dispatch]);

  const clearSelectionAction = useCallback(() => {
    dispatch(clearSelection());
  }, [dispatch]);

  const updateTaskOptimistically = useCallback((id: number, updates: any) => {
    dispatch(optimisticUpdateTask({ id, updates }));
  }, [dispatch]);

  return {
    // State
    tasks,
    selectedTasks,
    loading,
    error,
    total,
    pagination,
    searchParams,
    
    // Actions
    loadTasks,
    loadTaskById,
    addTask,
    editTask,
    removeTask,
    removeMultipleTasks,
    searchTasksAction,
    clearErrorAction,
    updateSearchParams,
    updatePagination,
    toggleSelection,
    selectAll,
    clearSelectionAction,
    updateTaskOptimistically,
  };
};

// Hook for task selection
export const useTaskSelection = () => {
  const dispatch = useAppDispatch();
  const selectedTasks = useAppSelector(selectSelectedTasks);
  const tasks = useAppSelector(selectTasks);

  const toggleSelection = useCallback((taskId: number) => {
    dispatch(toggleTaskSelection(taskId));
  }, [dispatch]);

  const selectAll = useCallback(() => {
    dispatch(selectAllTasks());
  }, [dispatch]);

  const clearSelection = useCallback(() => {
    dispatch(clearSelection());
  }, [dispatch]);

  const isSelected = useCallback((taskId: number) => {
    return selectedTasks.includes(taskId);
  }, [selectedTasks]);

  const isAllSelected = useCallback(() => {
    return tasks.length > 0 && selectedTasks.length === tasks.length;
  }, [tasks.length, selectedTasks.length]);

  const isPartiallySelected = useCallback(() => {
    return selectedTasks.length > 0 && selectedTasks.length < tasks.length;
  }, [selectedTasks.length, tasks.length]);

  return {
    selectedTasks,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isPartiallySelected,
  };
};

// Hook for task search and filtering
export const useTaskSearch = () => {
  const dispatch = useAppDispatch();
  const searchParams = useAppSelector(selectTasksSearchParams);
  const loading = useAppSelector(selectTasksLoading);

  const updateSearchParams = useCallback((params: any) => {
    dispatch(setSearchParams(params));
  }, [dispatch]);

  const performSearch = useCallback((params: any) => {
    dispatch(searchTasks(params));
  }, [dispatch]);

  const clearSearch = useCallback(() => {
    dispatch(setSearchParams({}));
  }, [dispatch]);

  return {
    searchParams,
    loading,
    updateSearchParams,
    performSearch,
    clearSearch,
  };
};
