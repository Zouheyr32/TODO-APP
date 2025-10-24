/**
 * Productivity Chart Component
 * Display productivity metrics in chart format
 */

"use client";

import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Paper,
  Grid,
  Chip,
  Alert,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { Metrics } from "@/store/slices/metricsSlice";

interface ProductivityChartProps {
  metrics: Metrics | null;
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ metrics }) => {
  if (!metrics) {
    return <Alert severity="info">No productivity data available.</Alert>;
  }

  const totalTasks = metrics.total_tasks || 0;
  const completedTasks = metrics.completed_tasks || 0;
  const pendingTasks = metrics.pending_tasks || 0;
  const deletedTasks = metrics.deleted_tasks || 0;

  // Calculate productivity metrics
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const efficiency =
    totalTasks > 0 ? ((completedTasks + pendingTasks) / totalTasks) * 100 : 0;
  const retentionRate =
    totalTasks > 0 ? ((totalTasks - deletedTasks) / totalTasks) * 100 : 0;

  const getProductivityScore = () => {
    const score = completionRate * 0.4 + efficiency * 0.3 + retentionRate * 0.3;
    return Math.round(score);
  };

  const productivityScore = getProductivityScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "primary";
    if (score >= 40) return "warning";
    return "error";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const scoreColor = getScoreColor(productivityScore);
  const scoreLabel = getScoreLabel(productivityScore);

  const productivityMetrics = [
    {
      label: "Completion Rate",
      value: completionRate,
      description: "Tasks completed vs total",
      icon: <CheckIcon />,
      color: "success",
    },
    {
      label: "Efficiency",
      value: efficiency,
      description: "Active tasks vs total",
      icon: <SpeedIcon />,
      color: "primary",
    },
    {
      label: "Retention Rate",
      value: retentionRate,
      description: "Tasks kept vs total",
      icon: <TrendingUpIcon />,
      color: "info",
    },
  ];

  return (
    <Box>
      {/* Overall Productivity Score */}
      <Paper sx={{ p: 3, mb: 3, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Productivity Score
        </Typography>
        <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={productivityScore}
            size={120}
            thickness={4}
            color={scoreColor as any}
            sx={{
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h4"
              component="div"
              color={`${scoreColor}.main`}
            >
              {productivityScore}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              / 100
            </Typography>
          </Box>
        </Box>
        <Chip
          label={scoreLabel}
          color={scoreColor as any}
          variant="outlined"
          size="small"
        />
      </Paper>

      {/* Detailed Metrics */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Breakdown
        </Typography>
        {productivityMetrics.map((metric, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ color: `${metric.color}.main` }}>{metric.icon}</Box>
                <Typography variant="body2" fontWeight="medium">
                  {metric.label}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {metric.value.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={metric.value}
              color={metric.color as any}
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block" }}
            >
              {metric.description}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Quick Stats */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Quick Stats
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="success.main">
                {completedTasks}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completed
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="warning.main">
                {pendingTasks}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProductivityChart;
