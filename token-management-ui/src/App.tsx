import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ApiKeyDisplay from "./components/ApiKeyDisplay";
import ThemeWrapper from "./theme";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AuthLayout from "@components/Layouts/AuthLayout";
import Signup from "./pages/auth/Signup";
import VerificationCode from "./pages/auth/ForgotPassword/VerifyCode";
import UIOverlayProvider from "./contexts/UIOverlayContext/UIOverlayProvider";
import AuthStatusGuard from "@components/RouteGuard/AuthStatusGuard";
import PermissionProfile from "@pages/apiKey/Permission.tsx";

function App() {
  return (
    <ThemeWrapper>
      <UIOverlayProvider>
        <Router>
          <Routes>
            <Route
              path='/'
              element={
                <AuthStatusGuard
                  redirectRoute='/apikey'
                  requiredAuthState={false}
                  layout={AuthLayout}
                />
              }
            >
              <Route path='/' element={<LoginPage />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/forgotPassword' element={<ForgotPassword />} />
              <Route path='/forgotPassword/verify' element={<VerificationCode />} />
            </Route>
            <Route element={<AuthStatusGuard redirectRoute='/' requiredAuthState={true} />}>
              <Route path='/apikey' element={<ApiKeyDisplay />} />
            </Route>
            {/* Will move this to another place after we have proper screen flow */}
            <Route path='/permissionProfile' element={<PermissionProfile />} />

            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </Router>
      </UIOverlayProvider>
    </ThemeWrapper>
  );
}

export default App;
