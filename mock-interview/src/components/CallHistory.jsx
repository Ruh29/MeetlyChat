import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Clock, Users, Video, Monitor, MessageCircle, Calendar } from 'lucide-react';
import { selectUser } from '../redux/authSlice';
import API from '../api/axios';

export default function CallHistory() {
  const [callHistory, setCallHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectUser);

  useEffect(() => {
    fetchCallHistory();
  }, []);

  const fetchCallHistory = async () => {
    try {
      const res = await API.get('/calls/history');
      setCallHistory(res.data.callHistory || []);
    } catch (err) {
      console.error('Failed to fetch call history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'ongoing':
        return 'text-blue-400 bg-blue-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-white">Call History</h2>
        <div className="text-gray-400">Loading call history...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 text-white">Call History</h2>
      
      {callHistory.length === 0 ? (
        <div className="text-center py-12">
          <Video className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">No call history found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {callHistory.map((call) => (
            <div
              key={call._id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white">
                    {call.interviewId?.title || 'Interview Call'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {call.interviewId?.name} - {call.interviewId?.role}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                  {call.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-blue-400" />
                  <span className="text-gray-300">
                    {formatDate(call.callStartTime)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-green-400" />
                  <span className="text-gray-300">
                    {formatDuration(call.duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-purple-400" />
                  <span className="text-gray-300">
                    {call.participants?.length || 0} participants
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Video size={16} className="text-yellow-400" />
                  <span className="text-gray-300">
                    Room: {call.roomId?.slice(0, 8)}...
                  </span>
                </div>
              </div>

              {/* Participants */}
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Participants:</h4>
                <div className="flex flex-wrap gap-2">
                  {call.participants?.map((participant, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300"
                    >
                      {participant.name} ({participant.role})
                      {participant.joinedAt && (
                        <span className="text-gray-500 ml-1">
                          • {formatDate(participant.joinedAt)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Used */}
              <div className="flex gap-4 text-xs">
                <div className={`flex items-center gap-1 ${
                  call.features?.screenShareUsed ? 'text-blue-400' : 'text-gray-500'
                }`}>
                  <Monitor size={14} />
                  Screen Share
                </div>
                <div className={`flex items-center gap-1 ${
                  call.features?.chatUsed ? 'text-green-400' : 'text-gray-500'
                }`}>
                  <MessageCircle size={14} />
                  Chat
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
