import { Theme } from "@mui/material";
import Button from "./Button";
import TextField from "./TextField";

const componentOverrides = (theme: Theme): Theme['components'] => {
  return {
    ...Button(theme),
    ...TextField(theme)
  };
};

export default componentOverrides;
