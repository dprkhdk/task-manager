import { createTheme } from "@mui/material/styles";
import "@mui/x-date-pickers/themeAugmentation";
const theme = createTheme({
  palette: {
    primary: {
      main: "#456bb2",
      contrastText: "#7ab9da",
    },
    secondary: {
      main: "#b2d43b",
      contrastText: "#bbe666",
    },
    error: {
      main: "#d32f2f",
      contrastText: "#ff7961",
    },
    warning: {
      main: "#f57c00",
      contrastText: "#ffb74d",
    },
    background: {
      default: "#f0f0f0",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1rem",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.1rem",
      textShadow: "1.5px 1.5px 3px rgba(0, 0, 0, 0.1)",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.1rem",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f0f0f0",
          overflowY: "auto",
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#7ab9da",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#456bb2",
            },
          },
        },
      },
    },
  },
});
export default theme;
