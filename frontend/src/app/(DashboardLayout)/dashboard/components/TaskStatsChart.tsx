/**
 * Task Statistics Chart Component
 * Display task statistics in chart format
 */

"use client";

import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { TaskStats } from "@/store/slices/metricsSlice";

interface TaskStatsChartProps {
  stats: TaskStats | null;
  loading?: boolean;
}

const TaskStatsChart: React.FC<TaskStatsChartProps> = ({
  stats,
  loading = false,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info">
        No statistics data available. Create some tasks to see analytics.
      </Alert>
    );
  }

  const totalTasks = stats.total_tasks || 0;
  const completedTasks = stats.completed_tasks || 0;
  const pendingTasks = stats.pending_tasks || 0;
  const deletedTasks = stats.deleted_tasks || 0;

  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const pendingRate = totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0;
  const deletedRate = totalTasks > 0 ? (deletedTasks / totalTasks) * 100 : 0;

  const getStatusColor = (rate: number) => {
    if (rate >= 80) return "success";
    if (rate >= 60) return "primary";
    if (rate >= 40) return "warning";
    return "error";
  };

  const getStatusLabel = (rate: number) => {
    if (rate >= 80) return "Excellent";
    if (rate >= 60) return "Good";
    if (rate >= 40) return "Fair";
    return "Needs Improvement";
  };

  const statsData = [
    {
      label: "Completed",
      value: completedTasks,
      percentage: completionRate,
      color: getStatusColor(completionRate),
      icon: <CheckIcon />,
      description: `${completionRate.toFixed(1)}% completion rate`,
    },
    {
      label: "Pending",
      value: pendingTasks,
      percentage: pendingRate,
      color: "warning",
      icon: <UncheckIcon />,
      description: `${pendingRate.toFixed(1)}% pending rate`,
    },
    {
      label: "Deleted",
      value: deletedTasks,
      percentage: deletedRate,
      color: "error",
      icon: <DeleteIcon />,
      description: `${deletedRate.toFixed(1)}% deletion rate`,
    },
  ];

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: 2,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Box sx={{ color: `${stat.color}.main`, mr: 1 }}>
                  {stat.icon}
                </Box>
                <Typography
                  variant="h4"
                  component="div"
                  color={`${stat.color}.main`}
                >
                  {stat.value}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {stat.label}
              </Typography>
              <Chip
                label={stat.description}
                size="small"
                color={stat.color as any}
                variant="outlined"
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Overall Performance */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overall Performance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Completion Rate
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {completionRate.toFixed(1)}%
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: 8,
                  backgroundColor: "grey.200",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${completionRate}%`,
                    height: "100%",
                    backgroundColor: `${getStatusColor(completionRate)}.main`,
                    transition: "width 0.3s ease-in-out",
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {getStatusLabel(completionRate)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Task Distribution
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {totalTasks} Total
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Box
                  sx={{
                    flex: completedTasks,
                    height: 8,
                    backgroundColor: "success.main",
                    borderRadius: 4,
                  }}
                />
                <Box
                  sx={{
                    flex: pendingTasks,
                    height: 8,
                    backgroundColor: "warning.main",
                    borderRadius: 4,
                  }}
                />
                <Box
                  sx={{
                    flex: deletedTasks,
                    height: 8,
                    backgroundColor: "error.main",
                    borderRadius: 4,
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: "success.main",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography variant="caption">Completed</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: "warning.main",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography variant="caption">Pending</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: "error.main",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography variant="caption">Deleted</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Key Metrics */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Key Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary.main">
                {totalTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tasks
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="success.main">
                {completionRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completion Rate
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="warning.main">
                {pendingTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Tasks
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="error.main">
                {deletedTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Deleted Tasks
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TaskStatsChart;
