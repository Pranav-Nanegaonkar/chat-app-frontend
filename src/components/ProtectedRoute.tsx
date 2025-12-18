import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <Loader className="size-10 animate-spin [animation-duration:1.5s]" />
      </div>
    );
  }

  if (!authUser) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
