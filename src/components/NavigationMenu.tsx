import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonIcon from "@mui/icons-material/Person";
// import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function NavigationMenu() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { label: "Home", to: "/", icon: <HomeIcon /> },
    { label: "Dashboard", to: "/dashboard", icon: <DashboardIcon /> },
    { label: "Tasks", to: "/tasks", icon: <TaskAltIcon /> },
    { label: "Projects", to: "/projects", icon: <AccountTreeIcon /> },
    { label: "Profile", to: "/profile", icon: <PersonIcon /> },
  ];

  const menuWidth = isMobile ? 80 : 220;

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: "background.paper",
        width: menuWidth,
        height: "100vh",
        left: 0,
        top: 0,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        zIndex: 1201,
        borderRight: "1px solid #e0e0e0",
        borderRadius: "0 8px 8px 0",
        px: 0,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          py: 3,
          px: isMobile ? 1 : 2,
          gap: 1.5,
        }}
      >
        {menuItems.map((item) => (
          <Button
            key={item.to}
            component={Link}
            to={item.to}
            sx={{
              width: "100%",
              minWidth: 0,
              justifyContent: isMobile ? "center" : "flex-start",
              color: location.pathname === item.to ? "#fff" : "text.primary",
              fontWeight: 500,
              borderRadius: 2,
              px: isMobile ? 0 : 2,
              py: 1.5,
              backgroundColor:
                location.pathname === item.to
                  ? "primary.contrastText"
                  : "transparent",
              "&:hover": {
                backgroundColor: "primary.contrastText",
                color: "#fff",
              },
              mb: 0.5,
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {item.icon}
            {!isMobile && (
              <Typography component="span" sx={{ ml: 2 }}>
                {item.label}
              </Typography>
            )}
          </Button>
        ))}
        <Box sx={{ flexGrow: 1 }} />
        {!isMobile && (
          <>
            <Divider sx={{ width: "100%", mb: 1 }} />
            <Box>
              <Typography
                variant="body2"
                component="span"
                color="text.secondary"
              >
                Created by:
              </Typography>
              <Typography
                href="https://denys-prykhodko.netlify.app/"
                component="a"
                target="_blank"
                variant="body2"
                color="text.secondary"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  ml: 0.5,
                  textDecoration: "none",
                  color: "primary.contrastText",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "primary.main",
                  },
                  transition: "color 0.2s, text-decoration 0.2s",
                }}
              >
                Denys Prykhodko
              </Typography>
            </Box>
          </>
        )}
        {/* {isMobile && (
          <>
            <Box sx={{ width: "100%", textAlign: "center", mb: 6 }}>
              <Divider sx={{ width: "100%", mb: 1 }} />
              <a href="https://denys-prykhodko.netlify.app/" target="_blank">
                <OpenInNewIcon
                  sx={{
                    width: "100%",

                    color: "text.secondary",
                  }}
                />
              </a>
            </Box>
          </>
        )} */}
      </Toolbar>
    </AppBar>
  );
}

export default NavigationMenu;
