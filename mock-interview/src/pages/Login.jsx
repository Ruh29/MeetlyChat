// import React from "react";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { login } from "../redux/authSlice";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (email && password) {
//       dispatch(loginUser({ email, name: "John Doe" }));
//       navigate("/dashboard");
//     } else {
//       alert("Please fill in all fields");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-slate-100">
//       <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
//         <h2 className="text-lg font-semibold mb-4">Login</h2>
//         <input
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border p-2 mb-3 rounded"
//           type="email"
//         />
//         <input
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border p-2 mb-3 rounded"
//           type="password"
//         />
//         <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/axios";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       const res = await API.post("/auth/login", { email, password });

//       // OTP sent message
//       alert(res.data.message);

//       // OTP verify page pe navigate
//       navigate("/verify-otp", { state: { email } });
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-700">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 animate-fadeIn"
//       >
//         <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
//         <input
//           placeholder="Email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//         <input
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border border-gray-300 p-3 mb-6 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//         <button
//           type="submit"
//           className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // const res = await API.post("/auth/login", { email, password });
      const res = await API.post("/auth/login", { email, password });


      // OTP sent
      alert(res.data.message);

      // OTP verify page pe navigate + email bhejna
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-700">
      <form
        onSubmit={handleLogin}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 animate-fadeIn"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-6 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Login
        </button>
      </form>
    </div>
  );
}
