"use client";
import { styled, Drawer, Box, useTheme } from "@mui/material";
import SidebarItems from "./SidebarItems";

const drawerWidth = 270;

const Sidebar = () => {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: 0,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <SidebarItems />
    </Drawer>
  );
};

export default Sidebar;
