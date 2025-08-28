import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthed, selectRole } from "../redux/authSlice";

export default function AdminRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthed);
  const role = useSelector(selectRole);

  if (!isAuthenticated || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
