// // import React, { useState } from "react";
// import {
//   Box,
//   TextField,
//   IconButton,
//   Typography,
//   Container,
//   Paper,
//   Snackbar,
//   Alert,
//   Button,
// } from "@mui/material";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import LogoutIcon from "@mui/icons-material/Logout";
// // import { useGetApiKeyQuery } from "../features/auth/authApi";
// // import { useAppDispatch } from "../store/hooks";
// // import { logout } from "../features/auth/authSlice";

// // const ApiKeyDisplay: React.FC = () => {
// //   const [showCopyAlert, setShowCopyAlert] = useState(false);
// //   const { data, isLoading, error } = useGetApiKeyQuery();
// //   const dispatch = useAppDispatch();

// //   const handleCopy = async () => {
// //     if (data?.apiKey) {
// //       try {
// //         await navigator.clipboard.writeText(data.apiKey);
// //         setShowCopyAlert(true);
// //       } catch (err) {
// //         console.error("Failed to copy:", err);
// //       }
// //     }
// //   };

// //   const handleLogout = () => {
// //     dispatch(logout());
// //   };

// //   if (isLoading) {
// //     return (
// //       <Container component="main" maxWidth="xs">
// //         <Typography>Loading API key...</Typography>
// //       </Container>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <Container component="main" maxWidth="xs">
// //         <Alert severity="error">
// //           Failed to load API key. Please try again later.
// //         </Alert>
// //       </Container>
// //     );
// //   }

// //   return (
// //     <Container component="main" maxWidth="xs">
// //       <Box
// //         sx={{
// //           marginTop: 8,
// //           display: "flex",
// //           flexDirection: "column",
// //           alignItems: "center",
// //           width: "100%",
// //         }}
// //       >
// //         <Typography
// //           component="h1"
// //           variant="h4"
// //           sx={{
// //             background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
// //             WebkitBackgroundClip: "text",
// //             WebkitTextFillColor: "transparent",
// //             mb: 3,
// //           }}
// //         >
// //           PEEL HUNT
// //         </Typography>

// //         <Typography component="h2" variant="h6" sx={{ mb: 3 }}>
// //           API Token Key
// //         </Typography>

// //         <Paper
// //           elevation={2}
// //           sx={{
// //             p: 3,
// //             width: "100%",
// //             borderRadius: 2,
// //           }}
// //         >
// //           <TextField
// //             fullWidth
// //             variant="outlined"
// //             value={data?.apiKey || ""}
// //             InputProps={{
// //               readOnly: true,
// //               endAdornment: (
// //                 <IconButton
// //                   onClick={handleCopy}
// //                   size="small"
// //                   sx={{
// //                     color: "primary.main",
// //                     "&:hover": {
// //                       color: "primary.dark",
// //                     },
// //                   }}
// //                 >
// //                   <ContentCopyIcon />
// //                 </IconButton>
// //               ),
// //             }}
// //           />
// //         </Paper>

// //         <Button
// //           startIcon={<LogoutIcon />}
// //           onClick={handleLogout}
// //           sx={{
// //             mt: 3,
// //             color: "text.secondary",
// //             "&:hover": {
// //               backgroundColor: "rgba(0, 0, 0, 0.04)",
// //             },
// //           }}
// //         >
// //           Logout
// //         </Button>

// //         <Snackbar
// //           open={showCopyAlert}
// //           autoHideDuration={3000}
// //           onClose={() => setShowCopyAlert(false)}
// //           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
// //         >
// //           <Alert
// //             onClose={() => setShowCopyAlert(false)}
// //             severity="success"
// //             sx={{ width: "100%" }}
// //           >
// //             API key copied to clipboard!
// //           </Alert>
// //         </Snackbar>
// //       </Box>
// //     </Container>
// //   );
// // };

// // export default ApiKeyDisplay;

// import React, { useState } from "react";
// // import { Container, Box, Typography, Button, Alert } from "@mui/material";
// // import LogoutIcon from "@mui/icons-material/Logout";
// import { useAppDispatch } from "../store/hooks";
// import { logout } from "../features/auth/authSlice";

// const ApiKeyDisplay: React.FC = () => {
//   const [showCopyAlert, setShowCopyAlert] = useState(false);
//   const dispatch = useAppDispatch();

//   // Hardcoded API key
//   const apiKey = "hardcoded-api-key";

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(apiKey);
//       setShowCopyAlert(true);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   //   return (
//   //     <Container component="main" maxWidth="xs">
//   //       <Box
//   //         sx={{
//   //           marginTop: 8,
//   //           display: "flex",
//   //           flexDirection: "column",
//   //           alignItems: "center",
//   //           width: "100%",
//   //         }}
//   //       >
//   //         <Typography variant="h6">Your API Key</Typography>
//   //         <Typography variant="body1" sx={{ mt: 2, wordBreak: "break-all" }}>
//   //           {apiKey}
//   //         </Typography>
//   //         <Button
//   //           variant="contained"
//   //           color="primary"
//   //           sx={{ mt: 2 }}
//   //           onClick={handleCopy}
//   //         >
//   //           Copy API Key
//   //         </Button>
//   //         {showCopyAlert && (
//   //           <Alert severity="success" sx={{ mt: 2 }}>
//   //             API key copied to clipboard!
//   //           </Alert>
//   //         )}
//   //         <Button
//   //           variant="outlined"
//   //           color="secondary"
//   //           sx={{ mt: 2 }}
//   //           startIcon={<LogoutIcon />}
//   //           onClick={handleLogout}
//   //         >
//   //           Logout
//   //         </Button>
//   //       </Box>
//   //     </Container>
//   //   );

//   return (
//     <Container component="main" maxWidth="xs">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           width: "100%",
//         }}
//       >
//         {/* <Typography
//           component="h1"
//           variant="h4"
//           sx={{
//             background: "linear-gradient(45deg, #6b46c1 30%, #805ad5 90%)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             mb: 3,
//           }}
//         >
//           PEEL HUNT
//         </Typography> */}

//         <Typography component="h2" variant="h6" sx={{ mb: 3 }}>
//           API Token Key
//         </Typography>

//         <Paper
//           elevation={2}
//           sx={{
//             p: 3,
//             width: "100%",
//             borderRadius: 2,
//           }}
//         >
//           <TextField
//             fullWidth
//             variant="outlined"
//             value={"api-key"}
//             InputProps={{
//               readOnly: true,
//               endAdornment: (
//                 <IconButton
//                   onClick={handleCopy}
//                   size="small"
//                   sx={{
//                     color: "primary.main",
//                     "&:hover": {
//                       color: "primary.dark",
//                     },
//                   }}
//                 >
//                   <ContentCopyIcon />
//                 </IconButton>
//               ),
//             }}
//           />
//         </Paper>

//         <Button
//           startIcon={<LogoutIcon />}
//           onClick={handleLogout}
//           sx={{
//             mt: 3,
//             color: "text.secondary",
//             "&:hover": {
//               backgroundColor: "rgba(0, 0, 0, 0.04)",
//             },
//           }}
//         >
//           Logout
//         </Button>

//         <Snackbar
//           open={showCopyAlert}
//           autoHideDuration={3000}
//           onClose={() => setShowCopyAlert(false)}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert
//             onClose={() => setShowCopyAlert(false)}
//             severity="success"
//             sx={{ width: "100%" }}
//           >
//             API key copied to clipboard!
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Container>
//   );
// };

// export default ApiKeyDisplay;

import React, { useState } from "react";
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
import image from "../assets/logo.jpeg";

const ApiKeyDisplay: React.FC = () => {
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const dispatch = useAppDispatch();

  // Hardcoded API key
  const apiKey = "AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQe ";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setShowCopyAlert(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

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

      {/* Main Content */}
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
                API Token Key
              </Typography>
            </Box>

            {/* API Key Section */}
            <Box
              sx={{
                p: 4,
                bgcolor: "white",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                value={apiKey}
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
          API key copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ApiKeyDisplay;
