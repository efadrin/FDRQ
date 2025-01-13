import { selectAuth } from "@features/auth/authSlice";
import { isTokenValid } from "@utils/jwtUtils";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const useAuth = () => {
  const { token, user } = useSelector(selectAuth);

  const isAuthenticated: boolean = useMemo(() => {
    if (!token) {
      return false;
    }

    return isTokenValid(token);
  }, [token]);

  return { isAuthenticated, user };
};

export default useAuth;
