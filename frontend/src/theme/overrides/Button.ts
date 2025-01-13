import { Components, Theme } from "@mui/material";

const Button = (theme: Theme): Pick<Components, "MuiButton"> => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontSize: 20,
          fontWeight: 400
        },
        contained: {
          color: theme.palette.common.white,
        },
      },
    },
  };
};

export default Button;
