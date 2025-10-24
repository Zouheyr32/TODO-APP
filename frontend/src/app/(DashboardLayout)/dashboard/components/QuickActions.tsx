/**
 * Quick Actions Component
 * Provide quick access to common actions
 */

"use client";

import React from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const QuickActions: React.FC = () => {
  const actions = [
    {
      label: "Create New Task",
      description: "Add a new task to your list",
      icon: <AddIcon />,
      href: "/tasks?action=create",
      color: "primary",
      variant: "contained" as const,
    },
    {
      label: "View All Tasks",
      description: "Manage your task list",
      icon: <EditIcon />,
      href: "/tasks",
      color: "primary",
      variant: "outlined" as const,
    },
    {
      label: "Completed Tasks",
      description: "View completed tasks",
      icon: <CheckIcon />,
      href: "/tasks?filter=completed",
      color: "success",
      variant: "outlined" as const,
    },
    {
      label: "Pending Tasks",
      description: "View pending tasks",
      icon: <UncheckIcon />,
      href: "/tasks?filter=pending",
      color: "warning",
      variant: "outlined" as const,
    },
  ];

  const quickStats = [
    {
      label: "Today's Progress",
      value: "0/0",
      description: "Tasks completed today",
      color: "primary",
    },
    {
      label: "This Week",
      value: "0/0",
      description: "Weekly completion rate",
      color: "success",
    },
    {
      label: "Productivity",
      value: "0%",
      description: "Overall productivity score",
      color: "info",
    },
  ];

  return (
    <Box>
      {/* Quick Actions */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <List sx={{ p: 0 }}>
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ p: 0, mb: 1 }}>
                <ListItemButton
                  component="a"
                  href={action.href}
                  sx={{
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon>
                    <Box sx={{ color: `${action.color}.main` }}>
                      {action.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={action.label}
                    secondary={action.description}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: "medium",
                    }}
                    secondaryTypographyProps={{
                      variant: "caption",
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {index < actions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Stats
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          {quickStats.map((stat, index) => (
            <Box key={index} sx={{ mb: index < quickStats.length - 1 ? 2 : 0 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h6" color={`${stat.color}.main`}>
                    {stat.value}
                  </Typography>
                </Box>
                <Chip
                  label={stat.description}
                  size="small"
                  color={stat.color as any}
                  variant="outlined"
                />
              </Box>
              {index < quickStats.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Paper>
      </Box>

      {/* Productivity Tips */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Productivity Tips
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <List sx={{ p: 0 }}>
            <ListItem sx={{ p: 0, mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <TrendingUpIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Set Clear Goals"
                secondary="Break down large tasks into smaller, manageable steps"
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: "medium",
                }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>
            <ListItem sx={{ p: 0, mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Complete Daily Tasks"
                secondary="Focus on completing at least one task per day"
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: "medium",
                }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>
            <ListItem sx={{ p: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <RefreshIcon color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Regular Reviews"
                secondary="Review and update your task list regularly"
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: "medium",
                }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default QuickActions;
