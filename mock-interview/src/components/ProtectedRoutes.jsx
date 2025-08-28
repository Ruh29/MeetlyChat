import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthed, selectRole } from "../redux/authSlice";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthed);
  const role = useSelector(selectRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
