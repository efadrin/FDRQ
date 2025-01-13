import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { useState } from "react";

type PasswordTextFieldProps = TextFieldProps & {
  shouldShowPasswod?: boolean;
  onToggleShowPassword?: () => void;
};

const PasswordTextField: React.FC<PasswordTextFieldProps> = ({ shouldShowPasswod, onToggleShowPassword, ...props }) => {
  const isControlled = shouldShowPasswod !== undefined;
  const [showPassword, setShowPassword] = useState(false);
  const handleToggleShowPassword = () => {
    console.log("toggle inside")
    if (!isControlled) {
      setShowPassword((prev) => !prev);
    } else {
      onToggleShowPassword?.();
    }
  };
  const effectiveShowPassword = isControlled ? shouldShowPasswod : showPassword;

  return (
    <TextField
      {...props}
      type={effectiveShowPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              onClick={handleToggleShowPassword}
              edge='end'
              sx={{ color: "text.secondary" }}
              aria-label={effectiveShowPassword ? "Hide password" : "Show password"}
            >
              {effectiveShowPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

export default PasswordTextField;
