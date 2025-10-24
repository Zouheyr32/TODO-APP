/**
 * Notification Provider Component
 * Global notification system for user feedback
 */

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Snackbar,
  Alert,
  AlertColor,
  IconButton,
  Slide,
  SlideProps,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface Notification {
  id: string;
  message: string;
  severity: AlertColor;
  duration?: number;
  action?: React.ReactNode;
}

interface NotificationContextType {
  showNotification: (
    message: string,
    severity?: AlertColor,
    duration?: number,
    action?: React.ReactNode
  ) => void;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (
      message: string,
      severity: AlertColor = "info",
      duration: number = 6000,
      action?: React.ReactNode
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification: Notification = {
        id,
        message,
        severity,
        duration,
        action,
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-hide notification after duration
      if (duration > 0) {
        setTimeout(() => {
          hideNotification(id);
        }, duration);
      }
    },
    []
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const contextValue: NotificationContextType = {
    showNotification,
    hideNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration}
          onClose={() => hideNotification(notification.id)}
          TransitionComponent={SlideTransition}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          sx={{ mb: 1 }}
        >
          <Alert
            severity={notification.severity}
            action={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {notification.action}
                <IconButton
                  size="small"
                  onClick={() => hideNotification(notification.id)}
                  color="inherit"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            }
            sx={{ minWidth: 300 }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};
