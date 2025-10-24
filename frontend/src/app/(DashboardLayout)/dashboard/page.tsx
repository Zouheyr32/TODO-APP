/**
 * Dashboard Page
 * Main dashboard with metrics and analytics
 */

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  useDashboardMetrics,
  useTaskStatistics,
  useCompletionRate,
} from "@/hooks";
import MetricsCards from "./components/MetricsCards";
import TaskStatsChart from "./components/TaskStatsChart";
import RecentTasks from "./components/RecentTasks";
import ProductivityChart from "./components/ProductivityChart";
import QuickActions from "./components/QuickActions";

const DashboardPage: React.FC = () => {
  const {
    metrics,
    loading: metricsLoading,
    error: metricsError,
    hasData,
    isEmpty,
    loadMetrics,
    refreshMetricsData,
  } = useDashboardMetrics();

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    hasStats,
    loadTaskStats,
  } = useTaskStatistics();

  const { completionRate, status, color } = useCompletionRate();

  const [refreshing, setRefreshing] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadMetrics();
    loadTaskStats();
  }, [loadMetrics, loadTaskStats]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshMetricsData(), loadTaskStats()]);
    } catch (error) {
      console.error("Failed to refresh dashboard data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Loading state
  if (metricsLoading || statsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (metricsError || statsError) {
    return (
      <Container maxWidth="xl">
        <Alert
          severity="error"
          action={
            <Button onClick={handleRefresh} color="inherit">
              Retry
            </Button>
          }
        >
          Failed to load dashboard data. Please try again.
        </Alert>
      </Container>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Your TODO Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start by creating your first task to see metrics and analytics here.
          </Typography>
          <Button variant="contained" size="large" href="/tasks" sx={{ mr: 2 }}>
            Create First Task
          </Button>
          <Button variant="outlined" size="large" onClick={handleRefresh}>
            Refresh
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip
                label={`Completion Rate: ${completionRate?.toFixed(1)}%`}
                color={
                  status === "excellent"
                    ? "success"
                    : status === "good"
                    ? "primary"
                    : "warning"
                }
                variant="outlined"
                sx={{ mr: 1 }}
              />
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </Box>
          </Box>

          {/* Status Indicator */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date().toLocaleString()}
            </Typography>
            {hasData && (
              <Chip
                label="Live Data"
                color="success"
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {/* Metrics Cards */}
        {hasData && (
          <Box sx={{ mb: 4 }}>
            <MetricsCards metrics={metrics} />
          </Box>
        )}

        {/* Charts and Analytics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Task Statistics Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Statistics
                </Typography>
                <TaskStatsChart stats={stats} loading={statsLoading} />
              </CardContent>
            </Card>
          </Grid>

          {/* Productivity Chart */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Productivity Overview
                </Typography>
                <ProductivityChart metrics={metrics} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Tasks and Quick Actions */}
        <Grid container spacing={3}>
          {/* Recent Tasks */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Tasks
                </Typography>
                <RecentTasks />
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <QuickActions />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
