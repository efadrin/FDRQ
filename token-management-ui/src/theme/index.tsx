import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";

import palette from "./palette";
import typography from "./typography";
import { PropsWithChildren, useMemo } from "react";
import componentOverrides from "./overrides";

const ThemeWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette,
      typography,
    }),
    []
  );
  const themes = createTheme(themeOptions);
  themes.components = componentOverrides(themes);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeWrapper;
