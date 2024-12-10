import { useAppSelector } from "./store/hooks";
import Login from "./components/Login";
import ApiKeyDisplay from "./components/APIKeyDisplay";
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
        {!user ? <Login /> : <ApiKeyDisplay />}
      </Box>
    </ThemeProvider>
  );
}

export default App;
