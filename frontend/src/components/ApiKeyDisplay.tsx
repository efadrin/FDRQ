import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
  Button,
  Stack
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../features/auth/authSlice";
import { RootState } from "../store/store"; // You'll need to create this type
import image from "../assets/logo.jpeg";

const ApiKeyDisplay: React.FC = () => {
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const dispatch = useAppDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const handleCopy = async () => {
    if (!auth.apiToken) return;

    try {
      await navigator.clipboard.writeText(auth.apiToken);
      setShowCopyAlert(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleApiDocumentClick = () => {
    window.location.href = "/slate/";
  };

  if (!auth.apiToken) {
    return (
      <Container>
        <Typography>No API token available. Please log in again.</Typography>
      </Container>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 24,
          left: 24
        }}
      >
        <img
          src={image}
          alt='Peel Hunt Logo'
          style={{
            width: 60,
            height: 60,
            objectFit: "contain",
            opacity: 0.9
          }}
        />
      </Box>

      <Container maxWidth='sm'>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
            justifyContent: "center"
          }}
        >
          <Box width='100%' mb={1}>
            <Typography
              variant='h6'
              sx={{
                color: "text.primary",
                fontWeight: 700
              }}
            >
              API Token Key
            </Typography>
          </Box>
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              borderRadius: 2,
              overflow: "hidden"
            }}
          >
            <Stack
              sx={{
                p: 4,
                bgcolor: "white"
              }}
              gap={3}
            >
              <Stack direction='row' gap={1}>
                <Typography
                  sx={{
                    color: "text.primary",
                    fontWeight: 700
                  }}
                >
                  Email:
                </Typography>
                <Typography
                  sx={{
                    color: "text.primary",
                    fontWeight: 500
                  }}
                >
                  {auth.user?.email}
                </Typography>
              </Stack>

              <TextField
                fullWidth
                variant='outlined'
                value={auth.apiToken}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <IconButton
                      onClick={handleCopy}
                      size='small'
                      sx={{
                        color: "primary.main",
                        "&:hover": {
                          color: "primary.dark"
                        }
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  )
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    backgroundColor: "#eaecef",
                    color: "#495057"
                  }
                }}
              />

              <Stack direction='row' gap={2}>
                <Button
                  onClick={handleApiDocumentClick}
                  variant='contained'
                  sx={{
                    borderRadius: 1.5,
                    px: 4,
                    py: 1.2,
                    fontSize: 16,
                    fontWeight: 500,
                    backgroundColor: "#1cb955",
                    ":hover": {
                      backgroundColor: "#18A44A"
                    }
                  }}
                >
                  API Documentation
                </Button>
                <Button
                  variant='contained'
                  sx={{
                    borderRadius: 1.5,
                    px: 4,
                    py: 1.2,
                    fontSize: 16,
                    fontWeight: 500,
                    backgroundColor: "#363636",
                    ":hover": {
                      backgroundColor: "#4A4A4A"
                    }
                  }}
                >
                  Regenerate
                </Button>
              </Stack>
            </Stack>
          </Paper>
          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            variant='outlined'
            sx={{
              mt: 4,
              height: 48,
              borderRadius: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              borderColor: "divider",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                borderColor: "text.secondary"
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={showCopyAlert}
        autoHideDuration={3000}
        onClose={() => setShowCopyAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowCopyAlert(false)}
          severity='success'
          sx={{
            width: "100%",
            "& .MuiAlert-message": {
              fontSize: "0.95rem"
            }
          }}
        >
          API token copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ApiKeyDisplay;
