/**
 * Metrics Redux Slice
 * Contains all metrics-related state management and async thunks
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

// Types
export interface Metrics {
  total_tasks: number;
  modified_tasks: number;
  deleted_tasks: number;
}

export interface TaskStats {
  total_created: number;
  total_modified: number;
  total_deleted: number;
  average_modifications: number;
}

export interface MetricsState {
  metrics: Metrics | null;
  stats: TaskStats | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Initial state
const initialState: MetricsState = {
  metrics: null,
  stats: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchMetrics = createAsyncThunk(
  "metrics/fetchMetrics",
  async () => {
    const { MetricsService } = await import("@/services/metricsService");
    return MetricsService.getMetrics();
  }
);

export const fetchTaskStats = createAsyncThunk(
  "metrics/fetchTaskStats",
  async () => {
    const { MetricsService } = await import("@/services/metricsService");
    return MetricsService.getTaskStats();
  }
);

export const refreshMetrics = createAsyncThunk(
  "metrics/refreshMetrics",
  async () => {
    const { MetricsService } = await import("@/services/metricsService");
    return MetricsService.refreshMetrics();
  }
);

// Metrics slice
const metricsSlice = createSlice({
  name: "metrics",
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

    // Update metrics optimistically (when tasks change)
    updateMetricsOptimistically: (
      state,
      action: PayloadAction<{
        type: "task_created" | "task_modified" | "task_deleted";
        taskId?: number;
      }>
    ) => {
      if (!state.metrics) return;

      const { type } = action.payload;

      switch (type) {
        case "task_created":
          state.metrics.total_tasks += 1;
          break;
        case "task_modified":
          state.metrics.modified_tasks += 1;
          break;
        case "task_deleted":
          state.metrics.total_tasks = Math.max(
            0,
            state.metrics.total_tasks - 1
          );
          state.metrics.deleted_tasks += 1;
          break;
      }
    },

    // Reset metrics
    resetMetrics: (state) => {
      state.metrics = null;
      state.stats = null;
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch metrics
    builder
      .addCase(fetchMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch metrics";
      });

    // Fetch task stats
    builder
      .addCase(fetchTaskStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTaskStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch task stats";
      });

    // Refresh metrics
    builder
      .addCase(refreshMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(refreshMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to refresh metrics";
      });
  },
});

// Export actions
export const {
  clearError,
  setLoading,
  updateMetricsOptimistically,
  resetMetrics,
} = metricsSlice.actions;

// Selectors
export const selectMetrics = (state: RootState) => state.metrics.metrics;
export const selectTaskStats = (state: RootState) => state.metrics.stats;
export const selectMetricsLoading = (state: RootState) => state.metrics.loading;
export const selectMetricsError = (state: RootState) => state.metrics.error;
export const selectMetricsLastUpdated = (state: RootState) =>
  state.metrics.lastUpdated;

// Computed selectors
export const selectTasksSummary = (state: RootState) => {
  const metrics = state.metrics.metrics;
  if (!metrics) return null;

  return {
    total: metrics.total_tasks,
    modified: metrics.modified_tasks,
    deleted: metrics.deleted_tasks,
  };
};

// Export reducer
export default metricsSlice.reducer;
