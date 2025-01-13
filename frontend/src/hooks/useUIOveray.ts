import { useContext } from "react";
import { UIOverlayContext, UIOverlayContextType } from "@contexts/UIOverlayContext";

const useUIOverlay = (): UIOverlayContextType => {
  const context = useContext(UIOverlayContext);
  if (!context) {
    throw new Error("useUIOverlay must be used within a UIOverlayContextProvider");
  }
  return context;
};

export default useUIOverlay;
