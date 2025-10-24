/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <ErrorIcon
                sx={{
                  fontSize: 64,
                  color: "error.main",
                  mb: 2,
                }}
              />
              <Typography variant="h4" gutterBottom color="error">
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                We encountered an unexpected error. Don't worry, your data is safe.
              </Typography>
            </Box>

            <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
              <AlertTitle>Error Details</AlertTitle>
              <Typography variant="body2" component="pre" sx={{ mt: 1 }}>
                {this.state.error?.message || "Unknown error occurred"}
              </Typography>
            </Alert>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
                size="large"
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
                size="large"
              >
                Go Home
              </Button>
            </Box>

            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <Box sx={{ mt: 4, textAlign: "left" }}>
                <Typography variant="h6" gutterBottom>
                  Development Error Details
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    backgroundColor: "grey.50",
                    maxHeight: 300,
                    overflow: "auto",
                  }}
                >
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {this.state.error?.stack}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{ fontSize: "0.75rem", mt: 2 }}
                  >
                    {this.state.errorInfo.componentStack}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
