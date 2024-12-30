import { Components, Theme } from "@mui/material";

const TextField = (theme: Theme): Pick<Components, "MuiTextField"> => {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            "&:hover .MuiOutlinedInput-notchedOutline" : {
              borderColor: theme.palette.primary.dark
            }
          },
        },
      },
    },
  };
};

export default TextField;
