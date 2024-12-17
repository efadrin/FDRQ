import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Container,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLoginMutation } from "../features/auth/authApi";
import { useAppDispatch } from "../store/hooks";
import { setUser, setApiToken } from "../features/auth/authSlice";
import image from "../assets/logo.jpeg";

const Login: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const response = await login({
        username_or_email: usernameOrEmail,
        password,
      }).unwrap();
      dispatch(setUser(response.user));
      dispatch(setApiToken(response.api_token)); // Store the API token
      console.log("Login successful", response);
    } catch (err: any) {
      console.error("Failed to login:", err);
      setErrorMessage(
        err.data?.details ||
          err.data?.error ||
          "Failed to login. Please check your credentials."
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 24,
          left: 24,
        }}
      >
        <img
          src={image}
          alt="Peel Hunt Logo"
          style={{
            width: 60,
            height: 60,
            objectFit: "contain",
            opacity: 0.9,
          }}
        />
      </Box>

      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: 450,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                bgcolor: "white",
                py: 3,
                px: 4,
                borderBottom: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  fontWeight: 400,
                }}
              >
                Sign in to your account
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 4,
                bgcolor: "white",
              }}
            >
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username_or_email"
                label="Username or Email"
                name="username_or_email"
                autoComplete="email"
                autoFocus
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  mb: 2,
                  height: 48,
                  backgroundColor: "#4FD1C5",
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#38B2AC",
                  },
                }}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Login;
