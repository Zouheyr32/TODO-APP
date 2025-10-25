"use client";
import {
  styled,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconHome, IconChecklist } from "@tabler/icons-react";
import Logo from "../shared/logo/Logo";

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: "4px 8px",
  borderRadius: "8px",
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.contrastText,
    },
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(() => ({
  minWidth: "40px",
}));

const SidebarItems = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      icon: IconHome,
      href: "/dashboard",
    },
    {
      title: "Tasks",
      icon: IconChecklist,
      href: "/tasks",
    },
  ];

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Logo />
      </Box>

      {/* Menu Items */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <List sx={{ px: 1, py: 2 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <ListItem key={item.title} disablePadding>
                <Link
                  href={item.href}
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <StyledListItemButton selected={isActive}>
                    <StyledListItemIcon>
                      <Icon size={20} />
                    </StyledListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          fontWeight={isActive ? 600 : 400}
                        >
                          {item.title}
                        </Typography>
                      }
                    />
                  </StyledListItemButton>
                </Link>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default SidebarItems;
