import { createContext } from "react";
import { NotificationProp } from "./types";

export interface NotificationContextType {
  triggerNotification: (prop: NotificationProp) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
