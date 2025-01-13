import { Typography, Box, TextField, Button, Stack, Alert } from "@mui/material";
import { useState } from "react";
import { useCreateUserMutation } from "@features/api/apiSlice";
import PasswordTextField from "@components/Input/PasswordTextField";
import { useNavigate } from "react-router-dom";
import useUIOverlay from "@hooks/useUIOveray";
import useNotification from "@hooks/useNotification";

const Signup = () => {
  const navigate = useNavigate();
  const { toggleLoading } = useUIOverlay();
  const { triggerNotification } = useNotification();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const [errorMessage, setErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [organization, setOrganization] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  // const dispatch = useAppDispatch();
  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      setErrorMessage("");
      toggleLoading(true);
      const response = await createUser({
        name,
        username,
        email,
        password
        // organization,
      }).unwrap();
      triggerNotification({ content: "Signup successful" });
      console.log("Signup successful", response);

      navigate("/");
    } catch (err) {
      console.error("Failed to signup:", err);
      setErrorMessage("Failed to signup");
    } finally {
      toggleLoading(false);
    }
  };
  return (
    <Box component='form' onSubmit={handleSubmit} p={4} pt={2}>
      <Stack spacing={2}>
        <Typography
          variant='h6'
          textAlign='center'
          sx={{
            color: "text.secondary",
            fontWeight: 700
          }}
        >
          Create Account
        </Typography>
        {errorMessage && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <TextField
          required
          fullWidth
          autoFocus
          id='name'
          label='Full Name'
          name='name'
          autoComplete='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          required
          fullWidth
          id='username'
          label='Username'
          name='username'
          autoComplete='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          required
          fullWidth
          id='email'
          label='Email Address'
          name='email'
          autoComplete='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          fullWidth
          id='organization'
          label='Organization'
          name='organization'
          autoComplete='organization'
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
        <PasswordTextField
          required
          fullWidth
          name='password'
          label='Password'
          id='password'
          autoComplete='current-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          shouldShowPasswod={showPassword}
          onToggleShowPassword={handleToggleShowPassword}
        />
        <PasswordTextField
          required
          fullWidth
          name='confirmPassword'
          label='Confirm Password'
          id='confirmPassword'
          autoComplete='current-password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          shouldShowPasswod={showPassword}
          onToggleShowPassword={handleToggleShowPassword}
        />
        <Button type='submit' fullWidth variant='contained' disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </Stack>
    </Box>
  );
};

export default Signup;
