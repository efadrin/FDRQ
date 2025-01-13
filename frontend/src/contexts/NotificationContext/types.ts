import { AlertProps, SnackbarOrigin } from "@mui/material";

export interface NotificationProp {
  origin?: SnackbarOrigin;
  onClose?: () => void;
  autoHideDuration?: number;
  serverity?: AlertProps["severity"];
  content: string;
  variant?: AlertProps["variant"];
  sx?: AlertProps["sx"];
}
