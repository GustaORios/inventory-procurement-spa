import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
