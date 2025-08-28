// import React from "react";
// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
//       <h1 className="text-3xl font-bold mb-6">Welcome to Mock Interview Portal</h1>
//       <div className="space-x-4">
//         <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded">Login</Link>
//         <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded">Register</Link>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react"; // icon import

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-black">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:justify-end items-center gap-3 p-6">
        <Link
          to="/login"
          className="bg-white text-black px-5 py-2 rounded-xl shadow hover:bg-gray-300 transition transform hover:scale-105 w-full sm:w-auto text-center"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-white text-black px-5 py-2 rounded-xl shadow hover:bg-gray-300 transition transform hover:scale-105 w-full sm:w-auto text-center"
        >
          Register
        </Link>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center mt-10 px-4">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-8 text-center">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">
            Meetly Interview Portal
          </span>
        </h1>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-2xl shadow-lg px-4 py-3 w-full max-w-md focus-within:ring-2 focus-within:ring-blue-400 transition">
          <input
            type="text"
            placeholder="Search interviews, calls..."
            className="w-full outline-none text-black text-sm"
          />
          <Search className="text-gray-700 ml-2" size={22} />
        </div>

        {/* 3 Feature Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 w-full max-w-6xl">
          {/* Box 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:bg-gray-200 transition transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800">
              Create Interview
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Schedule a new interview session, set date & time, and invite
              candidates with ease.
            </p>
          </div>

          {/* Box 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:bg-gray-200 transition transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800">
              Start Call
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Instantly connect with interviewees, share screen, and conduct
              live sessions seamlessly.
            </p>
          </div>

          {/* Box 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:bg-gray-200 transition transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800">
              Practice Mode
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Prepare with mock questions, record your responses, and analyze
              performance with AI assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
