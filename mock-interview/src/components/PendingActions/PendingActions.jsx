import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, Calendar, User } from "lucide-react";
import API from "../../api/axios";

const PendingActions = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingActions();
  }, []);

  const fetchPendingActions = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockActions = [
        {
          id: 1,
          title: "Review John Doe's Interview",
          type: "interview_review",
          dueDate: "2025-08-26",
          priority: "high",
          candidate: "John Doe",
          position: "Frontend Developer"
        },
        {
          id: 2,
          title: "Send offer letter to Jane Smith",
          type: "offer_letter",
          dueDate: "2025-08-27",
          priority: "medium",
          candidate: "Jane Smith",
          position: "Backend Developer"
        },
        {
          id: 3,
          title: "Schedule follow-up with Mike Johnson",
          type: "follow_up",
          dueDate: "2025-08-28",
          priority: "low",
          candidate: "Mike Johnson",
          position: "Full Stack Developer"
        }
      ];
      setActions(mockActions);
    } catch (error) {
      console.error("Failed to fetch pending actions:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = (actionId) => {
    setActions(prev => prev.filter(action => action.id !== actionId));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'interview_review': return <CheckCircle size={16} className="text-blue-400" />;
      case 'offer_letter': return <User size={16} className="text-green-400" />;
      case 'follow_up': return <Clock size={16} className="text-yellow-400" />;
      default: return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">⚡ Pending Actions</h2>
          <p className="text-gray-400">Tasks that require your immediate attention</p>
        </div>

        {actions.length > 0 ? (
          <div className="grid gap-4 md:gap-6">
            {actions.map((action) => (
              <div
                key={action.id}
                className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getTypeIcon(action.type)}
                      <h3 className="text-xl font-semibold text-white">{action.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(action.priority)}`}>
                        {action.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-400" />
                        <span>{action.candidate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-green-400" />
                        <span>Due: {action.dueDate}</span>
                      </div>
                      <div className="text-blue-400">
                        Position: {action.position}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => markAsCompleted(action.id)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Mark Complete
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm">
                      <Clock size={16} className="mr-2" />
                      Snooze
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-white mb-2">All caught up! 🎉</h3>
            <p className="text-gray-400">No pending actions at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingActions;
