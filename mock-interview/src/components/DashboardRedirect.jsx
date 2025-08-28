import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthed, selectRole } from "../redux/authSlice";

export default function DashboardRedirect() {
  const isAuthenticated = useSelector(selectIsAuthed);
  const role = useSelector(selectRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  } else {
    return <Navigate to="/user-dashboard" replace />;
  }
}
