import { Backdrop, CircularProgress } from "@mui/material";
import { PropsWithChildren, useCallback, useState } from "react";
import { UIOverlayContext } from ".";

const UIOverlayProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const toggleLoading = useCallback((state?: boolean) => {
    if (state === undefined) {
      setLoading((current) => !current);
      return;
    }
    setLoading(state);
  }, []);

  return (
    <UIOverlayContext.Provider value={{ toggleLoading }}>
      {children}
      <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </UIOverlayContext.Provider>
  );
};

export default UIOverlayProvider;
