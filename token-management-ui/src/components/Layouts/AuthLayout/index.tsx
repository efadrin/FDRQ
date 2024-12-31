import { Container, Stack } from "@mui/material";
import image from "@assets/peelhunt-logo.png";
import CenteredLayout from "../CenteredLayout";
import { PropsWithChildren } from "react";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <CenteredLayout>
      <Container maxWidth='sm'>
        <Stack alignItems='center'>
          <img src={image} />
        </Stack>
        {children}
      </Container>
    </CenteredLayout>
  );
};

export default AuthLayout;
