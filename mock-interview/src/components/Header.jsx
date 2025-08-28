// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../redux/authSlice";
// import { useNavigate } from "react-router-dom";

// export default function Header() {
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   return (
//     <header className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">
//       <h1 className="text-lg font-semibold">Dashboard</h1>
//       <div className="flex items-center gap-4">
//         {isAuthenticated && <span className="text-sm">{user?.name}</span>}
//         {isAuthenticated ? (
//           <button
//             onClick={handleLogout}
//             className="px-3 py-1 bg-red-500 text-white rounded text-sm"
//           >
//             Logout
//           </button>
//         ) : (
//           <button
//             onClick={() => navigate("/login")}
//             className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
//           >
//             Login
//           </button>
//         )}
//       </div>
//     </header>
//   );
// }
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">
      <h1 className="text-lg font-semibold">
        {user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
      </h1>

      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium">{user?.name || "Guest"}</span>
            <span className="text-xs text-gray-500 capitalize">
              {user?.role || "user"}
            </span>
          </div>
        )}

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
