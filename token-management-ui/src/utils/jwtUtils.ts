import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token: string): boolean => {
  try {
    console.log("token", token)
    const decoded = jwtDecode(token);

    const currentTime = Date.now() / 1000;
    if (decoded?.exp) {
      return decoded?.exp > currentTime;
    }
    return false;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};
