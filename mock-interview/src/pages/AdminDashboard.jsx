import Slidebar from "../components/Slidebar";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-auto bg-gray-900">
      {/* Sidebar */}
      <Slidebar />

      {/* Child content */}
      <div className="flex-1 min-h-screen p-4 md:p-6 bg-gray-900">
        <Outlet />
      </div>
    </div>
  );
}
