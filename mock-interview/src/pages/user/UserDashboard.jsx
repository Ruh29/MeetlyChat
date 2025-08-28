import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectUser, logout } from "../../redux/authSlice";
import API from "../../api/axios";
import { LogOut, Calendar, Video, MessageCircle } from "lucide-react";
import ChatBox from "../../components/ChatBox";
import NotificationBadge from "../../components/NotificationBadge";
import { useNotifications } from "../../hooks/useNotifications";

export default function UserDashboard() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const { unreadCount, markAsRead } = useNotifications();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get('/interviews');
        setInterviews(res.data.interviews || []);
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const today = new Date().toISOString().split('T')[0];
  const todayInterviews = interviews.filter(int => int.date === today);
  const upcomingInterviews = interviews.filter(int => int.date > today);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Interviews */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Calendar className="text-blue-600 mr-2" size={24} />
              <h2 className="text-xl font-semibold">Today's Interviews</h2>
            </div>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : todayInterviews.length > 0 ? (
              <div className="space-y-3">
                {todayInterviews.map(interview => (
                  <div key={interview._id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{interview.title}</h3>
                    <p className="text-gray-600">{interview.name} - {interview.role}</p>
                    <p className="text-sm text-gray-500">Time: {interview.time}</p>
                    <div className="flex gap-2 mt-2">
                      <Link
                        to={`/call/${interview.roomId}`}
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        <Video size={16} className="mr-1" />
                        Join Interview
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedInterview(interview);
                          setShowChat(true);
                          markAsRead();
                        }}
                        className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 relative"
                      >
                        <MessageCircle size={16} className="mr-1" />
                        Chat
                        <NotificationBadge count={unreadCount} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No interviews scheduled for today.</p>
            )}
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Calendar className="text-green-600 mr-2" size={24} />
              <h2 className="text-xl font-semibold">Upcoming Interviews</h2>
            </div>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {upcomingInterviews.map(interview => (
                  <div key={interview._id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{interview.title}</h3>
                    <p className="text-gray-600">{interview.name} - {interview.role}</p>
                    <p className="text-sm text-gray-500">
                      Date: {interview.date} | Time: {interview.time}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          setSelectedInterview(interview);
                          setShowChat(true);
                          markAsRead();
                        }}
                        className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 relative"
                      >
                        <MessageCircle size={16} className="mr-1" />
                        Chat
                        <NotificationBadge count={unreadCount} />
                      </button>
                    </div>
                    <div className="mt-2 text-xs">
                      <a 
                        href={interview.videoLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Click to Join Video Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming interviews.</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{interviews.length}</div>
            <div className="text-gray-600">Total Interviews</div>
          </div>
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{todayInterviews.length}</div>
            <div className="text-gray-600">Today</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{upcomingInterviews.length}</div>
            <div className="text-gray-600">Upcoming</div>
          </div>
        </div>

        {/* Chat Modal */}
        {showChat && selectedInterview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Interview Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <ChatBox 
                interviewId={selectedInterview._id} 
                interview={selectedInterview}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
