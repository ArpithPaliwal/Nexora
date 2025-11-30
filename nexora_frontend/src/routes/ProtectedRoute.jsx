import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authState"); 
  // If you are using cookies, replace this with your API check

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
