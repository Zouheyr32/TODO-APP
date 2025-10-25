/**
 * Metrics Cards Component
 * Display key metrics in card format
 */

"use client";

import React from "react";
import {
  Grid,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";
import { Metrics } from "@/store/slices/metricsSlice";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface MetricsCardsProps {
  metrics: Metrics | null;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
            <DashboardCard title="Loading..." sx={{ height: 200 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography color="text.secondary">Loading...</Typography>
              </Box>
            </DashboardCard>
          </Grid>
        ))}
      </Grid>
    );
  }

  const modifiedRate =
    metrics.total_tasks > 0
      ? (metrics.modified_tasks / metrics.total_tasks) * 100
      : 0;

  const deletedRate =
    metrics.total_tasks > 0
      ? (metrics.deleted_tasks / metrics.total_tasks) * 100
      : 0;

  const cards = [
    {
      title: "Total Tasks",
      value: metrics.total_tasks,
      icon: <AssignmentIcon color="primary" />,
      color: "primary",
      description: "All tasks created",
      trend: metrics.total_tasks > 0 ? "up" : "neutral",
    },
    {
      title: "Modified Tasks",
      value: metrics.modified_tasks,
      icon: <EditIcon color="info" />,
      color: "info",
      description: `${modifiedRate.toFixed(1)}% modification rate`,
      trend: modifiedRate > 0 ? "up" : "neutral",
      progress: modifiedRate,
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
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
          <DashboardCard
            title={card.title}
            action={
              <Stack direction="row" spacing={1} alignItems="center">
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
              </Stack>
            }
            sx={{ height: 200 }}
          >
            {/* Main Value */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h3"
                component="div"
                color={`${card.color}.main`}
                sx={{ fontWeight: 600 }}
              >
                {card.value}
              </Typography>
            </Box>

            {/* Progress Bar */}
            {card.progress !== undefined && (
              <Box sx={{ mb: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.progress.toFixed(1)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={card.progress}
                  color={card.color as any}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}

            {/* Description */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {card.description}
            </Typography>
          </DashboardCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricsCards;
