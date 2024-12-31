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

  // Get API token from Redux store
  const apiToken = useSelector((state: RootState) => state.auth.apiToken);

  const handleCopy = async () => {
    if (!apiToken) return;

    try {
      await navigator.clipboard.writeText(apiToken);
      setShowCopyAlert(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!apiToken) {
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
                API Token Key
              </Typography>
            </Box>

            <Box
              sx={{
                p: 4,
                bgcolor: "white",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                value={apiToken}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <IconButton
                      onClick={handleCopy}
                      size="small"
                      sx={{
                        color: "primary.main",
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />

              <Button
                fullWidth
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                variant="outlined"
                sx={{
                  mt: 3,
                  height: 48,
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  borderColor: "divider",
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    borderColor: "text.secondary",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Paper>
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
          severity="success"
          sx={{
            width: "100%",
            "& .MuiAlert-message": {
              fontSize: "0.95rem",
            },
          }}
        >
          API token copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ApiKeyDisplay;
