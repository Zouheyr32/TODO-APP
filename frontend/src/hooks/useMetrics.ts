/**
 * Custom Hooks for Metrics Operations
 * Convenient hooks for using metrics-related Redux actions and state
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchMetrics,
  fetchTaskStats,
  refreshMetrics,
  clearError,
  updateMetricsOptimistically,
  resetMetrics,
} from '@/store/slices/metricsSlice';
import {
  selectMetrics,
  selectTaskStats,
  selectMetricsLoading,
  selectMetricsError,
  selectMetricsLastUpdated,
  selectTasksSummary,
} from '@/store/slices/metricsSlice';

// Main metrics hook
export const useMetrics = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const metrics = useAppSelector(selectMetrics);
  const stats = useAppSelector(selectTaskStats);
  const loading = useAppSelector(selectMetricsLoading);
  const error = useAppSelector(selectMetricsError);
  const lastUpdated = useAppSelector(selectMetricsLastUpdated);
  const tasksSummary = useAppSelector(selectTasksSummary);

  // Actions
  const loadMetrics = useCallback(() => {
    dispatch(fetchMetrics());
  }, [dispatch]);

  const loadTaskStats = useCallback(() => {
    dispatch(fetchTaskStats());
  }, [dispatch]);

  const refreshMetricsData = useCallback(() => {
    dispatch(refreshMetrics());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateMetricsOptimisticallyAction = useCallback((type: 'task_created' | 'task_modified' | 'task_deleted', taskId?: number) => {
    dispatch(updateMetricsOptimistically({ type, taskId }));
  }, [dispatch]);

  const resetMetricsData = useCallback(() => {
    dispatch(resetMetrics());
  }, [dispatch]);

  return {
    // State
    metrics,
    stats,
    loading,
    error,
    lastUpdated,
    tasksSummary,
    
    // Actions
    loadMetrics,
    loadTaskStats,
    refreshMetricsData,
    clearError,
    updateMetricsOptimisticallyAction,
    resetMetricsData,
  };
};

// Hook for dashboard metrics specifically
export const useDashboardMetrics = () => {
  const {
    metrics,
    loading,
    error,
    loadMetrics,
    refreshMetricsData,
    updateMetricsOptimisticallyAction,
  } = useMetrics();

  const hasData = metrics !== null;
  const isEmpty = metrics && metrics.total_tasks === 0;

  return {
    metrics,
    loading,
    error,
    hasData,
    isEmpty,
    loadMetrics,
    refreshMetricsData,
    updateMetricsOptimisticallyAction,
  };
};

// Hook for task statistics
export const useTaskStatistics = () => {
  const {
    stats,
    loading,
    error,
    loadTaskStats,
  } = useMetrics();

  const hasStats = stats !== null;

  return {
    stats,
    loading,
    error,
    hasStats,
    loadTaskStats,
  };
};

// Hook for completion rate tracking (simplified for new metrics structure)
export const useCompletionRate = () => {
  const { metrics } = useMetrics();

  // Since we no longer track completion, return default values
  const completionRate = 0;
  const status = 'no-data';
  const color = '#9e9e9e'; // Grey

  return {
    completionRate,
    status,
    color,
    metrics,
  };
};
