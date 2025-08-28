import React, { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import API from "../../api/axios";
import ChatBox from "../../components/ChatBox";

export default function UpcomingInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get('/interviews');
        const today = new Date().toISOString().split('T')[0];
        const upcomingInterviews = res.data.interviews.filter(int => int.date > today);
        setInterviews(upcomingInterviews);
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : interviews.length === 0 ? (
        <p className="text-gray-500">No upcoming interviews.</p>
      ) : (
        <div className="space-y-4">
          {interviews.map(interview => (
            <div key={interview._id} className="border rounded-lg p-4 bg-white shadow">
              <h3 className="font-semibold">{interview.title}</h3>
              <p className="text-gray-600">{interview.name} - {interview.role}</p>
              <p className="text-sm text-gray-500">
                Date: {interview.date} | Time: {interview.time}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setSelectedInterview(interview);
                    setShowChat(true);
                  }}
                  className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  <MessageCircle size={16} className="mr-1" />
                  Chat
                </button>
              </div>
              <div className="mt-2 text-xs text-blue-600">
                Video Link: {interview.videoLink}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Modal */}
      {showChat && selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Interview Chat - {selectedInterview.name}</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
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
