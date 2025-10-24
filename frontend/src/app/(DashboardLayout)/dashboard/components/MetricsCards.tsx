/**
 * Metrics Cards Component
 * Display key metrics in card format
 */

"use client";

import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { Metrics } from "@/store/slices/metricsSlice";

interface MetricsCardsProps {
  metrics: Metrics | null;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 120,
                  }}
                >
                  <Typography color="text.secondary">Loading...</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  const completionRate =
    metrics.total_tasks > 0
      ? (metrics.completed_tasks / metrics.total_tasks) * 100
      : 0;

  const pendingRate =
    metrics.total_tasks > 0
      ? (metrics.pending_tasks / metrics.total_tasks) * 100
      : 0;

  const deletedRate =
    metrics.total_tasks > 0
      ? (metrics.deleted_tasks / metrics.total_tasks) * 100
      : 0;

  const getCompletionStatus = (rate: number) => {
    if (rate >= 80) return { color: "success", label: "Excellent" };
    if (rate >= 60) return { color: "primary", label: "Good" };
    if (rate >= 40) return { color: "warning", label: "Fair" };
    return { color: "error", label: "Poor" };
  };

  const completionStatus = getCompletionStatus(completionRate);

  const cards = [
    {
      title: "Total Tasks",
      value: metrics.total_tasks,
      icon: <EditIcon color="primary" />,
      color: "primary",
      description: "All tasks created",
      trend: metrics.total_tasks > 0 ? "up" : "neutral",
    },
    {
      title: "Completed Tasks",
      value: metrics.completed_tasks,
      icon: <CheckIcon color="success" />,
      color: "success",
      description: `${completionRate.toFixed(1)}% completion rate`,
      trend: completionRate > 50 ? "up" : "down",
      progress: completionRate,
    },
    {
      title: "Pending Tasks",
      value: metrics.pending_tasks,
      icon: <UncheckIcon color="warning" />,
      color: "warning",
      description: `${pendingRate.toFixed(1)}% pending rate`,
      trend: pendingRate < 50 ? "up" : "down",
      progress: pendingRate,
    },
    {
      title: "Deleted Tasks",
      value: metrics.deleted_tasks,
      icon: <DeleteIcon color="error" />,
      color: "error",
      description: `${deletedRate.toFixed(1)}% deletion rate`,
      trend: deletedRate < 10 ? "up" : "down",
      progress: deletedRate,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h3"
                    component="div"
                    color={`${card.color}.main`}
                  >
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {card.icon}
                  {card.trend && card.trend !== "neutral" && (
                    <Tooltip
                      title={`Trend: ${
                        card.trend === "up" ? "Increasing" : "Decreasing"
                      }`}
                    >
                      <IconButton size="small">
                        {card.trend === "up" ? (
                          <TrendingUpIcon color="success" />
                        ) : (
                          <TrendingDownIcon color="error" />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>

              {/* Progress Bar */}
              {card.progress !== undefined && (
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
                      Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.progress.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={card.progress}
                    color={card.color as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}

              {/* Description */}
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>

              {/* Status Chip for completion rate */}
              {card.title === "Completed Tasks" && (
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={completionStatus.label}
                    color={completionStatus.color as any}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricsCards;
