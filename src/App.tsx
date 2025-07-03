import { Box, useTheme, useMediaQuery } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavigationMenu from "./components/NavigationMenu.tsx";
import ProfilePage from "./pages/ProfilePage";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import DashboardPage from "./pages/DashboardPage";
import SingleTaskPage from "./pages/SingleTaskPage";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const mainContentMargin = isMobile ? "80px" : "220px";

  return (
    <>
      <Router>
        <NavigationMenu />
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            backgroundColor: "background.default",
            marginLeft: mainContentMargin,
            width: `calc(100% - ${mainContentMargin})`,
            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:taskId" element={<SingleTaskPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Box>
      </Router>
    </>
  );
}

export default App;
