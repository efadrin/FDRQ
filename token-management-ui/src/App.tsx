import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ApiKeyDisplay from "./components/ApiKeyDisplay";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// Create a custom theme to match the Peel Hunt design
const theme = createTheme({
  palette: {
    primary: {
      main: "#4FD1C5",
      dark: "#38B2AC",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Routes>
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/apikey" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/apikey" />}
            />
            <Route
              path="/apikey"
              element={user ? <ApiKeyDisplay /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
