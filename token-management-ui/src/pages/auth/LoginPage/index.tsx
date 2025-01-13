import React, { useState } from "react";
import { Box, TextField, Button, Typography, Stack, Alert } from "@mui/material";
import { useAppDispatch } from "@store/hooks";
import { useLoginMutation } from "@features/auth/authApi";
import { saveLoginResponse } from "@features/auth/authSlice";
import { Link } from "react-router-dom";
import PasswordTextField from "@components/Input/PasswordTextField";
import useUIOverlay from "@hooks/useUIOveray";
import useNotification from "@hooks/useNotification";

const LoginPage: React.FC = () => {
  const { toggleLoading } = useUIOverlay();
  const { triggerNotification } = useNotification();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    toggleLoading(true);
    try {
      const response = await login({
        username_or_email: usernameOrEmail,
        password
      }).unwrap();
      triggerNotification({ content: "Login successful" });
      dispatch(saveLoginResponse(response));
    } catch (err) {
      console.error("Failed to login:", err);
      setErrorMessage("Failed to login. Please check your credentials.");
    } finally {
      toggleLoading(false);
    }
  };

  return (
    <Box component='form' onSubmit={handleSubmit} p={4} pt={2}>
      {errorMessage && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Stack spacing={2} alignItems='center'>
        <Typography variant='h6' textAlign='center' color='text.secondary' fontWeight={700}>
          Sign in to your account
        </Typography>
        <TextField
          required
          fullWidth
          id='email'
          label='Email Address'
          name='email'
          autoComplete='email'
          autoFocus
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
        <Stack alignItems='end' width='100%'>
          <PasswordTextField
            required
            fullWidth
            name='password'
            label='Password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Link to='/forgotPassword'>
            <Typography fontWeight={700}>Forgot Password?</Typography>
          </Link>
        </Stack>

        <Button type='submit' fullWidth variant='contained' disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <Typography
          sx={{
            color: "text.secondary",
            fontWeight: 700
          }}
        >
          Don’t have an account? <Link to='/signup'>Register</Link>
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoginPage;
