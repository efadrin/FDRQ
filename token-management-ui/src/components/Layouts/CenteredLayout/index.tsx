import { Box } from "@mui/material";
import React, { PropsWithChildren } from "react";

const CenteredLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {children}
    </Box>
  );
};

export default CenteredLayout;
