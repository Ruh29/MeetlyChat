import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default user
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (name && email && password && role) {
      try {
        const res = await axios.post("http://localhost:5002/api/auth/register", {
          name,
          email,
          password,
          role,
        });

        alert(res.data.message || "Registration successful!");
        navigate("/login"); // Register ke baad login par redirect
      } catch (err) {
        console.error("Registration error:", err);
        const errorMessage = err.response?.data?.message || err.message || "Registration failed";
        alert(errorMessage);
      }
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-700">
      <form
        onSubmit={handleRegister}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 hover:scale-105"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Register
        </h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
          type="email"
        />

        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
          type="password"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition duration-300 shadow-md"
        >
          Register
        </button>
      </form>
    </div>
  );
}
