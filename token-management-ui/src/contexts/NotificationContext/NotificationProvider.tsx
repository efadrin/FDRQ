import { Alert, Snackbar } from "@mui/material";
import { PropsWithChildren, useCallback, useState } from "react";
import { NotificationContext } from ".";
import { NotificationProp } from "./types";

const NotificationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [notificationProp, setNotificationProp] = useState<NotificationProp>({ content: "" });

  const triggerNotification = useCallback((prop: NotificationProp) => {
    const { content, autoHideDuration, onClose, origin, serverity, sx, variant } = prop;
    setNotificationProp({
      sx,
      content,
      onClose,
      variant,
      serverity: serverity,
      autoHideDuration: autoHideDuration || 2000,
      origin: origin ? origin : { horizontal: "center", vertical: "top" }
    });
    setOpen(true);
  }, []);

  const onNotificationClose = () => {
    setOpen(false);
    notificationProp.onClose?.();
  };

  return (
    <NotificationContext.Provider value={{ triggerNotification }}>
      {children}
      <Snackbar
        anchorOrigin={notificationProp.origin}
        open={open}
        autoHideDuration={notificationProp.autoHideDuration}
        onClose={onNotificationClose}
      >
        <Alert
          onClose={onNotificationClose}
          severity={notificationProp.serverity}
          variant={notificationProp.variant}
          sx={notificationProp.sx}
        >
          {notificationProp.content}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
