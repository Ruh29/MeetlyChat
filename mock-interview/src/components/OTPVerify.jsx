// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function OtpVerify() {
//   const [otp, setOtp] = useState("");
//   const navigate = useNavigate();

//   const handleVerify = async () => {
//     try {
//       // 👇 Yaha API call kar ke OTP verify karo
//       // Example response:
//       const response = {
//         success: true,
//         role: "admin", // ya "user"
//         token: "sample-jwt-token",
//       };

//       if (response.success) {
//         // token save
//         localStorage.setItem("token", response.token);
//         localStorage.setItem("role", response.role);

//         // role check karke redirect
//         if (response.role === "admin") {
//           navigate("/admin-dashboard");
//         } else {
//           navigate("/dashboard");
//         }
//       } else {
//         alert("Invalid OTP!");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-700">
//       <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 animate-fadeIn">
//         <h1 className="text-3xl font-bold text-white text-center mb-6">
//           OTP Verification
//         </h1>
//         <input
//           type="text"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           placeholder="Enter OTP"
//           className="w-full px-4 py-2 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           onClick={handleVerify}
//           className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition duration-300"
//         >
//           Verify OTP
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { verifySuccess, selectAuth } from "../redux/authSlice";

export default function OTPVerify() {
  const location = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const pendingEmail = useSelector(selectAuth)?.pendingEmail || location.state?.email || "";

  const [email, setEmail] = useState(pendingEmail);
  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      dispatch(verifySuccess({
        user: res.data.user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken
      }));
      
      const userRole = res.data.user.role;
      alert(`${userRole} login successful!`);
      
      // Role-based redirect
      if (userRole === "admin") {
        nav("/admin-dashboard");
      } else {
        nav("/user-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP verify failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-700">
      <form onSubmit={handleVerify} className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Verify OTP</h2>
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
        <input placeholder="6-digit OTP" value={otp} onChange={(e)=>setOtp(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-6 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
        <button className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
          Verify
        </button>
      </form>
    </div>
  );
}
