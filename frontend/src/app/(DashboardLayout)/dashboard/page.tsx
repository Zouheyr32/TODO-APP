/**
 * Dashboard Page
 * Main dashboard with metrics and analytics - Spike Admin Style
 */

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useDashboardMetrics, useTaskStatistics } from "@/hooks";
import MetricsCards from "./components/MetricsCards";

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
    loadTaskStats,
  } = useTaskStatistics();

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
      refreshMetricsData();
      loadTaskStats();
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </Stack>
          </Stack>

          {/* Status Indicator */}
          <Stack direction="row" spacing={2} alignItems="center">
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
          </Stack>
        </Box>

        {/* Metrics Cards */}
        {hasData && (
          <Box sx={{ mb: 4 }}>
            <MetricsCards metrics={metrics} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DashboardPage;
