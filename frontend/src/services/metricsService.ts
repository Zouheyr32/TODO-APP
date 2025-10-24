/**
 * Metrics Service
 * API service for dashboard analytics and metrics
 */

import { api, ApiResponse } from './api';
import { Metrics, TaskStats } from '@/store/slices/metricsSlice';

// Metrics API endpoints
const METRICS_ENDPOINTS = {
  METRICS: '/metrics',
  STATS: '/metrics/stats',
  TRENDS: '/metrics/trends',
  MOST_MODIFIED: '/metrics/most-modified',
  PRODUCTIVITY: '/metrics/productivity',
  CATEGORIES: '/metrics/categories',
  HEALTH: '/metrics/health',
} as const;

// Metrics Service Class
export class MetricsService {
  /**
   * Get dashboard metrics
   */
  static async getMetrics(): Promise<Metrics> {
    const response = await api.get<Metrics>(METRICS_ENDPOINTS.METRICS);
    return response.data;
  }

  /**
   * Get detailed task statistics
   */
  static async getTaskStats(): Promise<TaskStats> {
    const response = await api.get<TaskStats>(METRICS_ENDPOINTS.STATS);
    return response.data;
  }

  /**
   * Get task completion trends over time
   */
  static async getCompletionTrends(days: number = 30): Promise<any> {
    const response = await api.get(`${METRICS_ENDPOINTS.TRENDS}?days=${days}`);
    return response.data;
  }

  /**
   * Get most modified tasks
   */
  static async getMostModifiedTasks(limit: number = 10): Promise<any> {
    const response = await api.get(`${METRICS_ENDPOINTS.MOST_MODIFIED}?limit=${limit}`);
    return response.data;
  }

  /**
   * Get productivity metrics
   */
  static async getProductivityMetrics(): Promise<any> {
    const response = await api.get(METRICS_ENDPOINTS.PRODUCTIVITY);
    return response.data;
  }

  /**
   * Get task category breakdown
   */
  static async getCategoryBreakdown(): Promise<any> {
    const response = await api.get(METRICS_ENDPOINTS.CATEGORIES);
    return response.data;
  }

  /**
   * Check metrics service health
   */
  static async getMetricsHealth(): Promise<any> {
    const response = await api.get(METRICS_ENDPOINTS.HEALTH);
    return response.data;
  }

  /**
   * Refresh all metrics data
   */
  static async refreshMetrics(): Promise<Metrics> {
    return this.getMetrics();
  }

  /**
   * Get comprehensive dashboard data
   */
  static async getDashboardData(): Promise<{
    metrics: Metrics;
    stats: TaskStats;
    trends: any;
    productivity: any;
  }> {
    try {
      const [metrics, stats, trends, productivity] = await Promise.all([
        this.getMetrics(),
        this.getTaskStats(),
        this.getCompletionTrends(30),
        this.getProductivityMetrics(),
      ]);

      return {
        metrics,
        stats,
        trends,
        productivity,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }

  /**
   * Get metrics with caching support
   */
  static async getMetricsWithCache(forceRefresh: boolean = false): Promise<Metrics> {
    const cacheKey = 'metrics_cache';
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes

    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheExpiry) {
          return data;
        }
      }
    }

    const metrics = await this.getMetrics();
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify({
      data: metrics,
      timestamp: Date.now(),
    }));

    return metrics;
  }

  /**
   * Clear metrics cache
   */
  static clearMetricsCache(): void {
    localStorage.removeItem('metrics_cache');
  }
}

// Export individual functions for convenience
export const {
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
} = MetricsService;

// Export the service class as default
export default MetricsService;
