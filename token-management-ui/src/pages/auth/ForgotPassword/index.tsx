import { Box, Button, Stack, TextField, Typography } from "@mui/material";
// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  const onButtonCLick = () => {
    navigate("/forgotPassword/verify");
  };

  return (
    <>
      <Box component='form' p={4} pt={2}>
        <Stack spacing={2} alignItems='center'>
          <Typography variant='h6' textAlign='center' color='text.secondary' fontWeight={700}>
            Password Recovery
          </Typography>
          <TextField
            required
            fullWidth
            id='email'
            label='Enter Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            // value={email}
            //   onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <Button type='submit' fullWidth variant='contained' onClick={onButtonCLick}>
            Continue
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default ForgotPassword;
