import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Video, User, Calendar, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/authSlice';
import API from '../api/axios';
import { io } from 'socket.io-client';
import { useNotifications } from '../hooks/useNotifications';
import NotificationToast from './NotificationToast';

export default function ChatBox({ interviewId, interview }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const user = useSelector(selectUser);
  const messagesEndRef = useRef(null);
  const { notifications, addNotification, removeNotification } = useNotifications();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (interviewId) {
      fetchMessages();
      
      // Initialize socket connection
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5004');
      setSocket(newSocket);
      
      // Join chat room for this interview
      newSocket.emit('joinChat', interviewId);
      
      // Listen for new messages
      newSocket.on('newMessage', (messageData) => {
        setMessages(prev => [...prev, messageData]);
        
        // Show notification if message is from someone else
        if (messageData.senderEmail !== user.email) {
          addNotification(messageData);
        }
      });
      
      return () => {
        newSocket.disconnect();
      };
    }
  }, [interviewId]);

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/chat/${interviewId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const res = await API.post(`/chat/${interviewId}`, {
        message: newMessage,
        senderEmail: user.email,
        senderName: user.name
      });
      
      // Emit message via socket for real-time updates
      if (socket) {
        socket.emit('sendMessage', {
          interviewId,
          message: newMessage,
          senderEmail: user.email,
          senderName: user.name
        });
      }
      
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const joinVideoCall = () => {
    if (interview?.roomId) {
      // Use React Router navigation instead of window.location
      window.open(`/call/${interview.roomId}`, '_blank');
    } else if (interview?.videoLink) {
      // Fallback to video link if roomId not available
      window.open(interview.videoLink, '_blank');
    } else {
      alert('Video call link not available');
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl h-80 md:h-96 flex flex-col text-white">
      {/* Header with Interview Details */}
      {interview && (
        <div className="bg-gray-700/50 p-3 md:p-4 border-b border-gray-600 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
            <h3 className="font-semibold text-white text-base md:text-lg">{interview.title}</h3>
            <button
              onClick={joinVideoCall}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition w-full sm:w-auto justify-center"
            >
              <Video size={16} />
              Join Call
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <User size={14} className="text-blue-400" />
              <span className="truncate">{interview.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-green-400" />
              <span>{interview.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-purple-400" />
              <span>{interview.time}</span>
            </div>
            <div className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded truncate">
              Role: {interview.role}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-gray-900/50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-6 md:py-8">
            💬 No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.senderEmail === user.email ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs px-3 md:px-4 py-2 md:py-3 rounded-xl ${
                  msg.senderEmail === user.email
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100 border border-gray-600'
                }`}
              >
                <div className="text-xs opacity-75 mb-1 font-medium">
                  {msg.senderName || msg.senderEmail}
                </div>
                <div className="text-sm leading-relaxed break-words">{msg.message}</div>
                <div className="text-xs opacity-75 mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-3 md:p-4 border-t border-gray-600 bg-gray-700/30">
        <div className="flex gap-2 md:gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 md:px-4 py-2 md:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg flex items-center gap-2 transition-all duration-200 min-w-[44px] justify-center"
          >
            <Send size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </form>

      {/* Notification Toasts */}
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          message={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}
