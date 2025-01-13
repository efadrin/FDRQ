import useAuth from "@hooks/useAuth";
import { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface AuthStatusGuardProps {
  requiredAuthState: boolean;
  layout?: React.FC<PropsWithChildren>;
  redirectRoute: string;
}

const AuthStatusGuard: React.FC<AuthStatusGuardProps> = ({
  requiredAuthState,
  layout: WrapperLayout,
  redirectRoute
}) => {
  const { isAuthenticated } = useAuth();

  if (requiredAuthState == isAuthenticated) {
    return WrapperLayout ? (
      <WrapperLayout>
        <Outlet />
      </WrapperLayout>
    ) : (
      <Outlet />
    );
  }

  return <Navigate to={redirectRoute} />;
};
export default AuthStatusGuard;
