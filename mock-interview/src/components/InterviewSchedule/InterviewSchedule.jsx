// // import React, { useEffect, useState, useMemo } from "react";
// // import axios from "axios";

// // function InterviewSchedule() {
// //   const [interviews, setInterviews] = useState([]);
// //   const [tab, setTab] = useState("today"); // "today" | "upcoming"
// //   const [editInterview, setEditInterview] = useState(null);

// //   // Filters
// //   const [q, setQ] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("all");
// //   const [fromDate, setFromDate] = useState("");
// //   const [toDate, setToDate] = useState("");

// //   const todayDate = new Date().toISOString().split("T")[0];

// //   // Fetch interviews from backend
// //   useEffect(() => {
// //     const fetchInterviews = async () => {
// //       try {
// //         const token = localStorage.getItem("accessToken");
// //         if (!token) return;

// //         const res = await axios.get("http://localhost:5000/api/interviews", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         setInterviews(res.data.interviews || res.data);
// //       } catch (err) {
// //         console.error(err);
// //         if (err.response && err.response.status === 401) {
// //           alert("Unauthorized! Please login again.");
// //           localStorage.removeItem("accessToken");
// //         } else {
// //           alert("Error fetching interviews");
// //         }
// //       }
// //     };
// //     fetchInterviews();
// //   }, []);

// //   // Filter by tab
// //   const baseList = useMemo(() => {
// //     return tab === "today"
// //       ? interviews.filter((i) => i.date === todayDate)
// //       : interviews.filter((i) => i.date > todayDate);
// //   }, [interviews, tab, todayDate]);

// //   // Apply search/status/date filters
// //   const filtered = useMemo(() => {
// //     let list = baseList;
// //     if (statusFilter !== "all") list = list.filter((i) => (i.status || "pending") === statusFilter);
// //     if (q.trim()) {
// //       const s = q.trim().toLowerCase();
// //       list = list.filter(
// //         (i) =>
// //           (i.candidate?.name || i.candidateName || "").toLowerCase().includes(s) ||
// //           (i.title || "").toLowerCase().includes(s)
// //       );
// //     }
// //     if (fromDate) list = list.filter((i) => i.date >= fromDate);
// //     if (toDate) list = list.filter((i) => i.date <= toDate);
// //     return list.slice().sort((a, b) => (a.time || "").localeCompare(b.time || ""));
// //   }, [baseList, q, statusFilter, fromDate, toDate]);

// //   // Update interview
// //   const handleUpdate = async () => {
// //     if (!editInterview) return;
// //     const token = localStorage.getItem("accessToken");
// //     try {
// //       const res = await axios.put(
// //         `http://localhost:5000/api/interviews/${editInterview._id}`,
// //         {
// //           candidateName: editInterview.candidateName || editInterview.candidate?.name,
// //           title: editInterview.title,
// //           notes: editInterview.notes,
// //           date: editInterview.date,
// //           time: editInterview.time,
// //           mode: editInterview.mode,
// //           duration: editInterview.duration,
// //         },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       setInterviews((prev) =>
// //         prev.map((i) => (i._id === editInterview._id ? res.data.interview : i))
// //       );
// //       setEditInterview(null);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error updating interview");
// //     }
// //   };

// //   // Mark as completed
// //   const markCompleted = async (id) => {
// //     const token = localStorage.getItem("accessToken");
// //     try {
// //       await axios.put(
// //         `http://localhost:5000/api/interviews/${id}/status`,
// //         { status: "completed" },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setInterviews((prev) =>
// //         prev.map((i) => (i._id === id ? { ...i, status: "completed" } : i))
// //       );
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error updating status");
// //     }
// //   };

// //   return (
// //     <div className="bg-gradient-to-br from-blue-50 to-white p-4 md:p-6 rounded-2xl shadow-md">
// //       <h2 className="text-xl font-bold mb-4 text-gray-800">📅 Interview Schedule</h2>

// //       {/* Tabs */}
// //       <div className="flex gap-2 mb-4">
// //         <button
// //           className={`flex-1 px-3 py-2 rounded-lg font-medium transition ${
// //             tab === "today"
// //               ? "bg-gray-700 text-white shadow"
// //               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
// //           }`}
// //           onClick={() => setTab("today")}
// //         >
// //           Today
// //         </button>
// //         <button
// //           className={`flex-1 px-3 py-2 rounded-lg font-medium transition ${
// //             tab === "upcoming"
// //               ? "bg-gray-700 text-white shadow"
// //               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
// //           }`}
// //           onClick={() => setTab("upcoming")}
// //         >
// //           Upcoming
// //         </button>
// //       </div>

// //       {/* Filters */}
// //       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
// //         <input
// //           value={q}
// //           onChange={(e) => setQ(e.target.value)}
// //           placeholder="Search name or role..."
// //           className="px-3 py-2 rounded-lg border bg-white text-sm"
// //         />
// //         <select
// //           value={statusFilter}
// //           onChange={(e) => setStatusFilter(e.target.value)}
// //           className="px-3 py-2 rounded-lg border bg-white text-sm"
// //         >
// //           <option value="all">All Status</option>
// //           <option value="pending">Pending</option>
// //           <option value="completed">Completed</option>
// //         </select>

// //         <input
// //           type="date"
// //           value={fromDate}
// //           onChange={(e) => setFromDate(e.target.value)}
// //           className="px-3 py-2 rounded-lg border bg-white text-sm"
// //         />
// //         <input
// //           type="date"
// //           value={toDate}
// //           onChange={(e) => setToDate(e.target.value)}
// //           className="px-3 py-2 rounded-lg border bg-white text-sm"
// //         />
// //       </div>

// //       {/* List */}
// //       <div className="space-y-3">
// //         {filtered.length > 0 ? (
// //           filtered.map((int) => (
// //             <div
// //               key={int._id}
// //               className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm hover:shadow-md transition"
// //             >
// //               <div className="flex-1">
// //                 <p className="font-semibold text-gray-800 text-sm sm:text-base">
// //                   {int.candidate?.name || int.candidateName} — {int.title}
// //                 </p>
// //                 <p className="text-gray-600 text-xs sm:text-sm">
// //                   {int.date} ⏰ {int.time || "—"}
// //                 </p>
// //                 <p className="text-gray-600 text-xs sm:text-sm">
// //                   Mode: {int.mode || "Online"}
// //                   {int.status && (
// //                     <span
// //                       className={`ml-2 inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
// //                         int.status === "completed"
// //                           ? "bg-green-100 text-green-700"
// //                           : "bg-amber-100 text-amber-700"
// //                       }`}
// //                     >
// //                       {int.status}
// //                     </span>
// //                   )}
// //                 </p>
// //               </div>

// //               <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
// //                 {/* Video Call */}
// //                 {int.mode === "Online" && int.videoCallId && (
// //                   <button
// //                     className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700"
// //                     onClick={() => window.open(`/video-call/${int.videoCallId}`, "_blank")}
// //                   >
// //                     🎥 Join Call
// //                   </button>
// //                 )}

// //                 {/* Mark Completed */}
// //                 {int.status !== "completed" && (
// //                   <button
// //                     className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs sm:text-sm hover:bg-emerald-700"
// //                     onClick={() => markCompleted(int._id)}
// //                   >
// //                     Mark as Completed
// //                   </button>
// //                 )}

// //                 {/* Update */}
// //                 <button
// //                   className="flex-1 sm:flex-none px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-xs sm:text-sm hover:bg-yellow-600"
// //                   onClick={() => setEditInterview(int)}
// //                 >
// //                   Update
// //                 </button>
// //               </div>
// //             </div>
// //           ))
// //         ) : (
// //           <p className="text-center text-gray-500 py-4 text-sm">
// //             {tab === "today"
// //               ? "No interviews scheduled for today."
// //               : "No upcoming interviews."}
// //           </p>
// //         )}
// //       </div>

// //       {/* Edit Modal */}
// //       {editInterview && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
// //           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
// //             <h3 className="text-lg font-bold mb-4 text-gray-800">✏️ Update Interview</h3>

// //             <input
// //               type="text"
// //               value={editInterview.candidateName || editInterview.candidate?.name || ""}
// //               onChange={(e) =>
// //                 setEditInterview({
// //                   ...editInterview,
// //                   candidateName: e.target.value,
// //                   candidate: { ...editInterview.candidate, name: e.target.value },
// //                 })
// //               }
// //               placeholder="Candidate Name"
// //               className="w-full p-2 border mb-2 rounded-lg"
// //             />
// //             <input
// //               type="text"
// //               value={editInterview.title || ""}
// //               onChange={(e) => setEditInterview({ ...editInterview, title: e.target.value })}
// //               placeholder="Interview Title"
// //               className="w-full p-2 border mb-2 rounded-lg"
// //             />
// //             <textarea
// //               value={editInterview.notes || ""}
// //               onChange={(e) => setEditInterview({ ...editInterview, notes: e.target.value })}
// //               placeholder="Notes"
// //               className="w-full p-2 border mb-2 rounded-lg"
// //             />
// //             <div className="flex gap-2 mb-2">
// //               <input
// //                 type="date"
// //                 value={editInterview.date || ""}
// //                 onChange={(e) => setEditInterview({ ...editInterview, date: e.target.value })}
// //                 className="w-1/2 p-2 border rounded-lg"
// //               />
// //               <input
// //                 type="text"
// //                 value={editInterview.duration || ""}
// //                 onChange={(e) => setEditInterview({ ...editInterview, duration: e.target.value })}
// //                 placeholder="Duration"
// //                 className="w-1/2 p-2 border rounded-lg"
// //               />
// //             </div>

// //             <div className="flex justify-end gap-2">
// //               <button
// //                 className="px-3 py-1.5 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm"
// //                 onClick={() => setEditInterview(null)}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
// //                 onClick={handleUpdate}
// //               >
// //                 Save
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default InterviewSchedule;
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createInterview, fetchInterviews } from "../../redux/interviewSlice";

// export default function InterviewSchedule() {
//   const dispatch = useDispatch();
//   const { adminInfo } = useSelector((state) => state.adminAuth);
//   const { list, loading, error } = useSelector((state) => state.interviews);

//   const [title, setTitle] = useState("");
//   const [date, setDate] = useState("");

//   // ✅ Fetch all interviews on mount
//   useEffect(() => {
//     dispatch(fetchInterviews());
//   }, [dispatch]);

//   // ✅ Create Interview (Admin)
//   const handleCreate = (e) => {
//     e.preventDefault();
//     if (!adminInfo?.token) {
//       alert("Unauthorized! Please login as Admin.");
//       return;
//     }

//     const formData = { title, date };
//     dispatch(createInterview({ formData, token: adminInfo.token }))
//       .unwrap()
//       .then(() => {
//         alert("Interview Created Successfully ✅");
//         setTitle("");
//         setDate("");
//       })
//       .catch((err) => alert(err));
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Interview Schedule</h2>

//       {/* ✅ Create Form */}
//       {adminInfo ? (
//         <form onSubmit={handleCreate} className="mb-6 space-y-3">
//           <input
//             type="text"
//             placeholder="Interview Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="border p-2 w-full rounded"
//             required
//           />
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="border p-2 w-full rounded"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             {loading ? "Creating..." : "Create Interview"}
//           </button>
//         </form>
//       ) : (
//         <p className="text-red-500">⚠️ Only Admins can create interviews</p>
//       )}

//       {/* ✅ Error Handling */}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* ✅ List of Interviews */}
//       <ul className="space-y-2">
//         {list.map((interview) => (
//           <li key={interview._id} className="p-3 border rounded shadow">
//             <h3 className="font-semibold">{interview.title}</h3>
//             <p>{new Date(interview.date).toDateString()}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import API from '../../api/axios'
import { useSelector } from "react-redux";
import { selectRole } from "../../redux/authSlice";
import { Link } from "react-router-dom";
import { Video, MessageCircle, Calendar, Clock, User, CheckCircle, Edit, Trash2, X, XCircle } from "lucide-react";
import ChatBox from "../ChatBox";

export default function InterviewSchedule() {
  const role = useSelector(selectRole);
  const [items, setItems] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const go = async () => {
      try {
        const res = await API.get("/interviews");
        setItems(res.data.interviews || []);
      } catch (e) {
        alert(e.response?.data?.message || "Failed to load");
      }
    };
    go();
  }, [role]);

  const today = new Date().toISOString().split('T')[0];
  const todayInterviews = items.filter(item => item.date === today);
  const upcomingInterviews = items.filter(item => item.date > today);

  const markAsCompleted = async (interviewId) => {
    try {
      await API.put(`/interviews/${interviewId}`, { status: 'completed' });
      setItems(prev => prev.map(item => 
        item._id === interviewId ? { ...item, status: 'completed' } : item
      ));
      alert('Interview marked as completed!');
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update status");
    }
  };

  const cancelInterview = async (interviewId) => {
    try {
      await API.put(`/interviews/${interviewId}`, { status: 'cancelled' });
      setItems(prev => prev.map(item => 
        item._id === interviewId ? { ...item, status: 'cancelled' } : item
      ));
      alert('Interview cancelled!');
    } catch (e) {
      alert(e.response?.data?.message || "Failed to cancel interview");
    }
  };

  const deleteInterview = async (interviewId) => {
    if (!confirm('Are you sure you want to delete this interview?')) return;
    try {
      await API.delete(`/interviews/${interviewId}`);
      setItems(prev => prev.filter(item => item._id !== interviewId));
      alert('Interview deleted!');
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete interview");
    }
  };

  const updateInterview = async () => {
    try {
      const res = await API.put(`/interviews/${editingInterview._id}`, editingInterview);
      setItems(prev => prev.map(item => 
        item._id === editingInterview._id ? res.data.interview : item
      ));
      setShowEditModal(false);
      setEditingInterview(null);
      alert('Interview updated successfully!');
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update interview");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Completed</span>;
      case 'cancelled':
        return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">Cancelled</span>;
      default:
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <h2 className="text-3xl font-bold mb-8 text-white">📅 Interview Schedule</h2>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Today's Interviews */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <Calendar className="text-blue-400 mr-3" size={28} />
              <h3 className="text-2xl font-semibold text-white">Today's Interviews</h3>
            </div>
            {todayInterviews.length > 0 ? (
              <div className="space-y-4">
                {todayInterviews.map((interview) => (
                  <div key={interview._id} className="bg-gray-700/50 border border-gray-600 rounded-xl p-5 hover:bg-gray-700/70 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg text-white">{interview.title}</h4>
                      {getStatusBadge(interview.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-400" />
                        <span>{interview.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-green-400" />
                        <span>{interview.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">Role: <span className="text-blue-400">{interview.role}</span></p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/call/${interview.roomId}`}
                        className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                      >
                        <Video size={16} className="mr-2" />
                        Join Call
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedInterview(interview);
                          setShowChat(true);
                        }}
                        className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm"
                      >
                        <MessageCircle size={16} className="mr-2" />
                        Chat
                      </button>
                      
                      {interview.status !== 'completed' && (
                        <button
                          onClick={() => markAsCompleted(interview._id)}
                          className="flex items-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Complete
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setEditingInterview(interview);
                          setShowEditModal(true);
                        }}
                        className="flex items-center px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition text-sm"
                      >
                        <Edit size={16} className="mr-2" />
                        Edit
                      </button>
                      
                      {interview.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelInterview(interview._id)}
                          className="flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition text-sm"
                        >
                          <XCircle size={16} className="mr-2" />
                          Cancel
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteInterview(interview._id)}
                        className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-500 mb-4" size={48} />
                <p className="text-gray-400">No interviews scheduled for today</p>
              </div>
            )}
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <Calendar className="text-green-400 mr-3" size={28} />
              <h3 className="text-2xl font-semibold text-white">Upcoming Interviews</h3>
            </div>
            {upcomingInterviews.length > 0 ? (
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div key={interview._id} className="bg-gray-700/50 border border-gray-600 rounded-xl p-5 hover:bg-gray-700/70 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg text-white">{interview.title}</h4>
                      {getStatusBadge(interview.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-400" />
                        <span>{interview.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-400" />
                        <span>{interview.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-green-400" />
                        <span>{interview.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">Role: <span className="text-blue-400">{interview.role}</span></p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button
                        onClick={() => {
                          setSelectedInterview(interview);
                          setShowChat(true);
                        }}
                        className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm"
                      >
                        <MessageCircle size={16} className="mr-2" />
                        Chat
                      </button>
                      
                      <button
                        onClick={() => {
                          setEditingInterview(interview);
                          setShowEditModal(true);
                        }}
                        className="flex items-center px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition text-sm"
                      >
                        <Edit size={16} className="mr-2" />
                        Edit
                      </button>
                      
                      {interview.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelInterview(interview._id)}
                          className="flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition text-sm"
                        >
                          <XCircle size={16} className="mr-2" />
                          Cancel
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteInterview(interview._id)}
                        className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </button>
                    </div>
                    
                    <div className="text-xs text-blue-400 bg-blue-500/10 p-2 rounded">
                      Video Link: {interview.videoLink}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-500 mb-4" size={48} />
                <p className="text-gray-400">No upcoming interviews</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Modal */}
        {showChat && selectedInterview && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[95vh] md:max-h-[80vh] overflow-hidden relative">
              {/* Mobile Close Button - Top Right */}
              <button
                onClick={() => setShowChat(false)}
                className="absolute top-4 right-4 z-10 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition md:hidden"
              >
                <X size={20} />
              </button>
              
              {/* Header */}
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-700">
                <h3 className="text-lg md:text-xl font-semibold text-white pr-12 md:pr-0">Interview Chat</h3>
                {/* Desktop Close Button */}
                <button
                  onClick={() => setShowChat(false)}
                  className="hidden md:block text-gray-400 hover:text-white transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Chat Content */}
              <div className="p-4 md:p-6">
                <ChatBox 
                  interviewId={selectedInterview._id} 
                  interview={selectedInterview}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingInterview && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md">
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Edit Interview</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <input
                  type="text"
                  value={editingInterview.title || ''}
                  onChange={(e) => setEditingInterview({...editingInterview, title: e.target.value})}
                  placeholder="Interview Title"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={editingInterview.name || ''}
                  onChange={(e) => setEditingInterview({...editingInterview, name: e.target.value})}
                  placeholder="Candidate Name"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={editingInterview.role || ''}
                  onChange={(e) => setEditingInterview({...editingInterview, role: e.target.value})}
                  placeholder="Job Role"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={editingInterview.date || ''}
                    onChange={(e) => setEditingInterview({...editingInterview, date: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={editingInterview.time || ''}
                    onChange={(e) => setEditingInterview({...editingInterview, time: e.target.value})}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateInterview}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
