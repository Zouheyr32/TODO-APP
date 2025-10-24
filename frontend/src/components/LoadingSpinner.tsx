/**
 * Loading Spinner Component
 * Reusable loading component with different variants
 */

"use client";

import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Skeleton,
} from "@mui/material";

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  variant?: "circular" | "linear" | "skeleton";
  fullScreen?: boolean;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message = "Loading...",
  variant = "circular",
  fullScreen = false,
  color = "primary",
}) => {
  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        ...(fullScreen && {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 9999,
        }),
      }}
    >
      {variant === "circular" && (
        <CircularProgress size={size} color={color} />
      )}
      {variant === "linear" && (
        <Box sx={{ width: "100%", maxWidth: 300 }}>
          <LinearProgress color={color} />
        </Box>
      )}
      {variant === "skeleton" && (
        <Box sx={{ width: "100%", maxWidth: 300 }}>
          <Skeleton variant="rectangular" width="100%" height={4} />
        </Box>
      )}
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  return content;
};

export default LoadingSpinner;
