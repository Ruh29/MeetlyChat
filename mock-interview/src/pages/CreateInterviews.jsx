// // import React, { useState } from "react";
// // import axios from "axios";

// // function CreateInterview() {
// //   const [candidateName, setCandidateName] = useState("");
// //   const [title, setTitle] = useState("");
// //   const [date, setDate] = useState("");
// //   const [time, setTime] = useState("");
// //   const [mode, setMode] = useState("Online");
// //   const [notes, setNotes] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const handleCreate = async () => {
// //     const token = localStorage.getItem("accessToken");
// //     console.log("Access Token:", token);

// //     if (!token) {
// //       alert("You must be logged in to create an interview!");
// //       return;
// //     }

// //     if (!candidateName || !title || !date) {
// //       alert("Please fill in candidate name, title, and date.");
// //       return;
// //     }

// //     const interviewData = {
// //       candidateName,
// //       title,
// //       date,
// //       time,
// //       mode,
// //       notes,
// //     };

// //     setLoading(true);

// //     try {
// //       const res = await axios.post(
// //         "http://localhost:5000/api/interviews/create",
// //         interviewData,
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );

// //       console.log("Interview Created:", res.data);
// //       alert("Interview created successfully!");
// //     } catch (err) {
// //       console.error(err);

// //       if (err.response && err.response.status === 401) {
// //         alert("Unauthorized! Please login again.");
// //         localStorage.removeItem("accessToken");
// //       } else {
// //         alert("Error creating interview.");
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl mt-6">
// //       <h2 className="text-xl font-bold mb-4">📅 Create Interview</h2>

// //       <input
// //         type="text"
// //         placeholder="Candidate Name"
// //         value={candidateName}
// //         onChange={(e) => setCandidateName(e.target.value)}
// //         className="w-full p-2 mb-2 border rounded-lg"
// //       />
// //       <input
// //         type="text"
// //         placeholder="Role / Title"
// //         value={title}
// //         onChange={(e) => setTitle(e.target.value)}
// //         className="w-full p-2 mb-2 border rounded-lg"
// //       />
// //       <input
// //         type="date"
// //         value={date}
// //         onChange={(e) => setDate(e.target.value)}
// //         className="w-full p-2 mb-2 border rounded-lg"
// //       />
// //       <input
// //         type="time"
// //         value={time}
// //         onChange={(e) => setTime(e.target.value)}
// //         className="w-full p-2 mb-2 border rounded-lg"
// //       />
// //       <select
// //         value={mode}
// //         onChange={(e) => setMode(e.target.value)}
// //         className="w-full p-2 mb-2 border rounded-lg"
// //       >
// //         <option value="Online">Online</option>
// //         <option value="In-person">In-person</option>
// //       </select>
// //       <textarea
// //         value={notes}
// //         onChange={(e) => setNotes(e.target.value)}
// //         placeholder="Notes"
// //         className="w-full p-2 mb-2 border rounded-lg"
// //       />

// //       <button
// //         onClick={handleCreate}
// //         disabled={loading}
// //         className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
// //       >
// //         {loading ? "Creating..." : "Create Interview"}
// //       </button>
// //     </div>
// //   );
// // }

// // export default CreateInterview;
// // import React, { useState } from "react";
// // import axios from "axios";
// // import { useSelector } from "react-redux";

// // const CreateInterview = () => {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     role: "",
// //     time: "",
// //     date: "",
// //     candidateEmail: "",
// //   });
// //   const [message, setMessage] = useState("");

// //   const { userInfo } = useSelector((state) => state.auth); // 🔑 token yahan se ayega

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setMessage("");

// //     try {
// //       const { data } = await axios.post(
// //         "/api/interviews/create",
// //         formData,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${userInfo?.token}`, // token bhejna zaruri
// //           },
// //         }
// //       );

// //       setMessage("✅ Interview Created Successfully!");
// //       setFormData({
// //         name: "",
// //         role: "",
// //         time: "",
// //         date: "",
// //         candidateEmail: "",
// //       });
// //     } catch (err) {
// //       setMessage(err.response?.data?.message || "❌ Error creating interview");
// //     }
// //   };

// //   return (
// //     <div className="p-4 border rounded w-[400px] mx-auto mt-5">
// //       <h2 className="text-xl font-bold mb-3">Create Interview</h2>
// //       <form onSubmit={handleSubmit} className="space-y-3">
// //         <input
// //           type="text"
// //           name="name"
// //           placeholder="Candidate Name"
// //           value={formData.name}
// //           onChange={handleChange}
// //           className="border p-2 w-full"
// //         />
// //         <input
// //           type="text"
// //           name="role"
// //           placeholder="Role"
// //           value={formData.role}
// //           onChange={handleChange}
// //           className="border p-2 w-full"
// //         />
// //         <input
// //           type="date"
// //           name="date"
// //           value={formData.date}
// //           onChange={handleChange}
// //           className="border p-2 w-full"
// //         />
// //         <input
// //           type="time"
// //           name="time"
// //           value={formData.time}
// //           onChange={handleChange}
// //           className="border p-2 w-full"
// //         />
// //         <input
// //           type="email"
// //           name="candidateEmail"
// //           placeholder="Candidate Email"
// //           value={formData.candidateEmail}
// //           onChange={handleChange}
// //           className="border p-2 w-full"
// //         />

// //         <button
// //           type="submit"
// //           className="bg-blue-500 text-white p-2 rounded w-full"
// //         >
// //           Create Interview
// //         </button>
// //       </form>
// //       {message && <p className="mt-3 text-center">{message}</p>}
// //     </div>
// //   );
// // };

// // export default CreateInterview;
// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import API from "../api/axios";
// import { selectAdmin } from "../redux/adminAuthSlice";

// export default function CreateInterviews() {
//   const admin = useSelector(selectAdmin); // ✅ redux se admin info lo
//   const [title, setTitle] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [candidateEmail, setCandidateEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleCreate = async (e) => {
//     e.preventDefault();

//     if (!title || !date || !time || !candidateEmail) {
//       alert("Please fill all fields");
//       return;
//     }

//     if (!admin?.token) {
//       alert("Admin not logged in!");
//       return;
//     }

//     try {
//       setLoading(true);

//       // ✅ API call with token
//       const res = await API.post(
//         "/interviews/create",
//         { title, date, time, candidateEmail },
//         {
//           headers: {
//             Authorization: `Bearer ${admin.token}`, // fallback (agar interceptor miss kare)
//           },
//         }
//       );

//       alert(res.data.message || "Interview created successfully");
//       setTitle("");
//       setDate("");
//       setTime("");
//       setCandidateEmail("");
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Failed to create interview");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-900">
//       <form
//         onSubmit={handleCreate}
//         className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96"
//       >
//         <h2 className="text-2xl font-bold text-center text-white mb-6">
//           Create Interview
//         </h2>

//         <input
//           type="text"
//           placeholder="Interview Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />

//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />

//         <input
//           type="time"
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//           className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />

//         <input
//           type="email"
//           placeholder="Candidate Email"
//           value={candidateEmail}
//           onChange={(e) => setCandidateEmail(e.target.value)}
//           className="w-full border border-gray-300 p-3 mb-6 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
//         >
//           {loading ? "Creating..." : "Create"}
//         </button>
//       </form>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectRole } from "../redux/authSlice";
import API from "../api/axios";

export default function CreateInterview() {
  const role = useSelector(selectRole);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  if (role !== "admin") {
    return <div className="p-6 text-center">Admin only. Please login as admin.</div>;
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/interviews/create", {
        title, name, role: jobRole, date, time, candidateEmail
      });
      setLink(res.data.interview.videoLink);
      alert(res.data.message);
      setTitle(""); setName(""); setJobRole(""); setDate(""); setTime(""); setCandidateEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form onSubmit={submit} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Create Interview</h2>

        <input type="text" placeholder="Interview Title" value={title} onChange={(e)=>setTitle(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>

        <input type="text" placeholder="Candidate Name" value={name} onChange={(e)=>setName(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>

        <input type="text" placeholder="Job Role" value={jobRole} onChange={(e)=>setJobRole(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>

        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>

        <input type="time" value={time} onChange={(e)=>setTime(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-4 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>

        <input type="email" placeholder="Candidate Email" value={candidateEmail} onChange={(e)=>setCandidateEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 mb-6 rounded bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>

        <button type="submit" disabled={loading}
          className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
          {loading ? "Creating..." : "Create"}
        </button>

        {link && (
          <div className="mt-4 text-white text-sm">
            Video Link: <a className="underline" href={link} target="_blank" rel="noreferrer">{link}</a>
          </div>
        )}
      </form>
    </div>
  );
}
