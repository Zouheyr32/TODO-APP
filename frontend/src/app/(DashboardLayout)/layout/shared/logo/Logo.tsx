import Link from "next/link";
import { styled, Box, Typography } from "@mui/material";
import { Checklist as ChecklistIcon } from "@mui/icons-material";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ChecklistIcon sx={{ color: "primary.main", fontSize: 32 }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          TODO App
        </Typography>
      </Box>
    </LinkStyled>
  );
};

export default Logo;
