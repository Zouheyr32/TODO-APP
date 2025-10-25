"use client";
import {
  styled,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { toggleLeftDrawer } from "@/store/slices/customizerSlice";
import Profile from "./Profile";

const HeaderWrapper = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Header = () => {
  const dispatch = useDispatch();
  const leftDrawerOpened = useSelector(
    (state: RootState) => state.customizer.opened
  );

  const handleLeftDrawerToggle = () => {
    dispatch(toggleLeftDrawer());
  };

  return (
    <HeaderWrapper position="sticky" elevation={0}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleLeftDrawerToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TODO App
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Profile />
        </Box>
      </Toolbar>
    </HeaderWrapper>
  );
};

export default Header;
