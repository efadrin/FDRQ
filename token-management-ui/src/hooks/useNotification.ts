import { useContext } from "react";
import { NotificationContext, NotificationContextType } from "@contexts/NotificationContext";

const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationContextProvider");
  }
  return context;
};

export default useNotification;
