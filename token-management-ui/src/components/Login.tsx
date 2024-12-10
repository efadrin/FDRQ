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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLoginMutation } from "../features/auth/authApi";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../features/auth/authSlice";
import { useCreateUserMutation } from "../features/api/apiSlice";
import image from "../assets/logo.jpeg";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const [createUser] = useCreateUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        email,
        password,
        username: email, // or however you want to handle username
      });
      // Handle successful login
      console.log("User created successfully");
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (email === "lars.mitchel@peelhunt.com" && password === "testuser") {
  //     const hardCodedUser = {
  //       id: 1,
  //       name: "Abhishek Poswal",
  //       email: "abhishek.poswal@efa.biz",
  //     };
  //     dispatch(setUser(hardCodedUser));
  //   } else {
  //     try {
  //       const response = await login({ email, password }).unwrap();
  //       dispatch(setUser(response.user));
  //     } catch (err) {
  //       console.error("Failed to login:", err);
  //     }
  //   }
  // };

  return (
    <>
      {/* Logo in top left corner */}
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

      {/* Login Container */}
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
            {/* Header Section */}
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

            {/* Form Section */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 4,
                bgcolor: "white",
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
