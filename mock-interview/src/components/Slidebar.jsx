import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { X, Menu, LogOut } from "lucide-react";
import { logout, selectUser } from "../redux/authSlice";

export default function Slidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-4 bg-gray-800 text-white shadow-lg">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 bg-gray-800 text-white w-70  transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block md:h-screen overflow-y-auto`}
      >
        <div className="p-4 mb-6">
          <div className="hidden md:block">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
            <p className="text-sm text-gray-300">Welcome, {user?.name}</p>
          </div>
          <div className="md:hidden pt-16">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
            <p className="text-sm text-gray-300">Welcome, {user?.name}</p>
          </div>
        </div>
        <ul className="space-y-2 px-4 md:min-h-0">
           
         
          <li>
            <Link 
              to="/admin-dashboard/pending-actions" 
              className="block py-3 px-3 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm md:text-base"
              onClick={() => setIsOpen(false)}
            >
              📋 Pending Actions
            </Link>
          </li>
          <li>
            <Link 
              to="/admin-dashboard/schedule" 
              className="block py-3 px-3 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm md:text-base"
              onClick={() => setIsOpen(false)}
            >
              📅 Interview Schedule
            </Link>
          </li>
          <li>
            <Link 
              to="/admin-dashboard/send-email" 
              className="block py-3 px-3 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm md:text-base"
              onClick={() => setIsOpen(false)}
            >
              📧 Send Email to Shortlisted
            </Link>
          </li>
          <li>
            <Link 
              to="/admin-dashboard/create" 
              className="block py-3 px-3 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm md:text-base"
              onClick={() => setIsOpen(false)}
            >
              🎯 Create Interview
            </Link>
          </li>
          <li className="pt-4 mt-4 border-t border-gray-600">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full py-3 px-3 hover:bg-red-600 rounded-lg text-left transition-colors duration-200 text-sm md:text-base"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
