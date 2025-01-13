import { createContext } from "react";

export interface UIOverlayContextType {
  toggleLoading: (state?: boolean) => void;
}

export const UIOverlayContext = createContext<UIOverlayContextType | undefined>(undefined);
