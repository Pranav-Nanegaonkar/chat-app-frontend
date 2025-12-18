import type React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Toaster } from "react-hot-toast";
import Test from "./pages/Test";
import ProtectedRoute from "./components/ProtectedRoute";
const App: React.FC = () => {
  const { checkAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, []);


  // console.log(onlineUsers);


  // if (isCheckingAuth && authUser === null) {
  //   return (
  //     <div className="h-[80vh] flex justify-center items-center">
  //       <Loader className="size-10 animate-spin [animation-duration:1.5s] " />
  //     </div>
  //   );
  // }
  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          // element={authUser ? <HomePage /> : <Navigate to="/login" />}
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          // element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          element={<SignupPage />}
        />
        <Route
          path="/login"
          // element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          element={<LoginPage />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          // element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/test" element={<Test />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
