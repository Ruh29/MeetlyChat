import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import API from "../api/axios";
import ChatBox from "../components/ChatBox";
import NotificationBadge from "../components/NotificationBadge";
import { useNotifications } from "../hooks/useNotifications";

export default function UpcomingInterviews() {
  const today = new Date().toISOString().split("T")[0];
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const { unreadCount, markAsRead } = useNotifications();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get('/interviews');
        const upcomingInterviews = res.data.interviews.filter(int => int.date > today);
        setInterviews(upcomingInterviews);
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [today]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Upcoming Interviews</h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : interviews.length === 0 ? (
        <p className="text-gray-400">No upcoming interviews</p>
      ) : (
        <ul className="space-y-4">
          {interviews.map((interview) => (
            <li key={interview._id} className="p-4 bg-gray-800 border border-gray-700 shadow rounded flex justify-between items-center">
              <div className="text-white">
                <p className="font-semibold">{interview.name}</p>
                <p className="text-sm text-gray-400">{interview.role}</p>
                <p className="text-xs text-gray-500 mt-1">Date: {interview.date} | Time: {interview.time}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setSelectedInterview(interview);
                      setShowChat(true);
                      markAsRead();
                    }}
                    className="px-3 py-2 font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center relative"
                  >
                    <MessageCircle size={16} className="mr-1" />
                    Chat
                    <NotificationBadge count={unreadCount} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-400 bg-blue-500/10 p-2 rounded">
                  Video Link: {interview.videoLink}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Chat Modal */}
      {showChat && selectedInterview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[95vh] md:max-h-[80vh] overflow-hidden relative">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-white">Interview Chat - {selectedInterview.name}</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
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
  );
}
