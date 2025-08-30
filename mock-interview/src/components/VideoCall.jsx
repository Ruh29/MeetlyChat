import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  MessageCircle,
  Settings,
  Users,
  Clock,
  X
} from 'lucide-react';
import { selectUser } from '../redux/authSlice';
import { io } from 'socket.io-client';
import API from '../api/axios';
import ChatBox from './ChatBox';
import IncomingCallModal from './IncomingCallModal';

export default function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [callId, setCallId] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionState, setConnectionState] = useState('new');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isRinging, setIsRinging] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const callStartTimeRef = useRef(null);
  const durationIntervalRef = useRef(null);

  // ICE servers configuration
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Fetch interview details
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await API.get(`/interviews/room/${roomId}`);
        setInterview(res.data.interview);
      } catch (err) {
        console.error('Failed to fetch interview:', err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchInterview();
    }
  }, [roomId, navigate]);

  // Initialize socket and WebRTC
  useEffect(() => {
    if (!user || !roomId) return;

    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5004');
    const socket = socketRef.current;

    // Socket event listeners
    socket.on('user-joined', handleUserJoined);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-ended', handleRemoteCallEnd);
    socket.on('incoming-call', handleIncomingCall);
    socket.on('room-participants', ({ participants, roomId }) => {
      console.log(`Room ${roomId} has ${participants} participants`);
      setParticipants(prev => [...prev, { count: participants }]);
    });
    socket.on('call-accepted', ({ acceptedBy }) => {
      console.log('Call accepted by:', acceptedBy);
      // Prevent infinite loop - only admin should handle this
      if (user.role === 'admin' && !callStarted && !isCallActive) {
        console.log('Admin: User accepted call, ready for connection');
      }
    });
    socket.on('call-rejected', () => {
      console.log('Call rejected by other participant');
      alert('Call was rejected by the other participant');
    });

    // Listen for existing call state in room
    socket.on('room-call-active', ({ roomId, isActive }) => {
      console.log(`Room ${roomId} call active status:`, isActive);
      // Don't auto-join, just show the green button is ready
    });

    // Join room immediately when component loads
    socket.emit('join-room', { roomId, user: { name: user.name, email: user.email, role: user.role } });
    console.log(`User ${user.name} joining room: ${roomId}`);

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [user, roomId, localStream]);

  // Auto-assign video streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // WebRTC event handlers
  const handleUserJoined = async ({ userId, userInfo }) => {
    console.log('User joined:', userId, userInfo);
    setParticipants(prev => [...prev.filter(p => p.id !== userId), { id: userId, ...userInfo }]);
    
    if (!peerConnectionRef.current) {
      await createPeerConnection();
    }
    
    // Create and send offer
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current.emit('offer', { roomId, offer, targetId: userId });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleUserLeft = ({ userId }) => {
    console.log('User left:', userId);
    setParticipants(prev => prev.filter(p => p.id !== userId));
    setRemoteStream(null);
    setConnectionState('disconnected');
  };

  const handleOffer = async ({ offer, senderId }) => {
    if (!peerConnectionRef.current) {
      await createPeerConnection();
    }
    
    try {
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketRef.current.emit('answer', { roomId, answer, targetId: senderId });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async ({ answer }) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async ({ candidate }) => {
    try {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const handleRemoteCallEnd = () => {
    endCall();
  };

  const handleIncomingCall = ({ caller, roomId: incomingRoomId }) => {
    setIncomingCall({ caller, roomId: incomingRoomId });
    setIsRinging(true);
  };

  const acceptCall = async () => {
    setIsRinging(false);
    setIncomingCall(null);
    // Auto start call when accepting
    await handleStartCall();
    
    // Notify caller that call was accepted
    socketRef.current.emit('call-accepted', { roomId });
  };

  const rejectCall = () => {
    setIsRinging(false);
    setIncomingCall(null);
    // Notify caller of rejection
    socketRef.current.emit('call-rejected', { roomId });
  };

  // Create peer connection
  const createPeerConnection = async () => {
    const pc = new RTCPeerConnection(iceServers);
    peerConnectionRef.current = pc;

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          roomId,
          candidate: event.candidate
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
      if (pc.connectionState === 'connected' && !callStartTimeRef.current) {
        startCallTimer();
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        stopCallTimer();
      }
    };
  };

  // Get user media
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  };

  // Start call timer
  const startCallTimer = () => {
    callStartTimeRef.current = Date.now();
    durationIntervalRef.current = setInterval(() => {
      if (callStartTimeRef.current) {
        setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
      }
    }, 1000);
  };

  // Stop call timer
  const stopCallTimer = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    callStartTimeRef.current = null;
  };

  // Auto-join when user enters room with active admin call
  const autoJoinCall = async () => {
    try {
      if (user.role === 'admin' || callStarted || isCallActive) {
        return;
      }

      console.log('🔵 Auto-joining admin call...');
      await handleJoinCall();
      
    } catch (error) {
      console.error('Failed to auto-join call:', error);
    }
  };

  // Start call (Admin only)
  const handleStartCall = async () => {
    try {
      // Only admin can start calls
      if (user.role !== 'admin') {
        alert('Only admin can start calls');
        return;
      }

      // Check if call is already started to prevent duplicate calls
      if (callStarted || isCallActive) {
        console.log('Call already started');
        return;
      }

      console.log('🚀 Admin starting call...');

      // Get user media first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setCallStarted(true);
      setIsCallActive(true);
      callStartTimeRef.current = Date.now();
      
      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Create call in backend
      try {
        const callResponse = await API.post('/calls/start', {
          roomId,
          interviewId: interview._id
        });
        
        setCallId(callResponse.data.callHistory._id);
        
        // Notify socket about call start
        socketRef.current.emit('call-started', {
          roomId,
          callId: callResponse.data.callHistory._id,
          interviewId: interview._id
        });
        
        console.log('🔔 Admin ringing participants...');
        // Ring other participants
        socketRef.current.emit('ring-participants', {
          roomId,
          caller: {
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } catch (backendError) {
        console.log('Backend call creation failed');
      }

      // Create peer connection
      await createPeerConnection();
      
    } catch (error) {
      console.error('Failed to start call:', error);
      alert('Failed to start call. Please check your camera and microphone permissions.');
    }
  };

  // Join call (User only - when accepting admin's call)
  const handleJoinCall = async () => {
    try {
      // Only users can join calls (not start them)
      if (user.role === 'admin') {
        handleStartCall();
        return;
      }

      // Check if call is already started
      if (callStarted || isCallActive) {
        console.log('Already in call');
        return;
      }

      console.log('🔵 User joining admin call...');

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setCallStarted(true);
      setIsCallActive(true);
      callStartTimeRef.current = Date.now();
      
      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Create peer connection (no backend call creation for users)
      await createPeerConnection();
      
    } catch (error) {
      console.error('Failed to join call:', error);
      alert('Failed to join call. Please check your camera and microphone permissions.');
    }
  };

  // End call
  const endCall = () => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Leave room and notify others
    if (socketRef.current) {
      socketRef.current.emit('leaveRoom', roomId);
      socketRef.current.emit('call-ended', { roomId, callId });
    }

    // Reset states
    setLocalStream(null);
    setRemoteStream(null);
    setCallStarted(false);
    setIsCallActive(false);
    setConnectionState('new');
    setParticipants([]);
    stopCallTimer();
    setCallDuration(0);
  };

  // Handle end call button
  const handleEndCall = async () => {
    try {
      // Update call history in backend
      if (callId) {
        await API.patch(`/calls/${callId}/end`);
      }
      
      endCall();
      
      // Navigate based on user role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Failed to end call:', error);
      endCall();
      
      // Navigate based on user role even on error
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = peerConnectionRef.current.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );

      if (sender) {
        await sender.replaceTrack(videoTrack);
      }

      setIsScreenSharing(true);
      socketRef.current.emit('screen-share-start', { roomId });

      videoTrack.onended = () => {
        stopScreenShare();
      };

    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  // Stop screen sharing
  const stopScreenShare = async () => {
    try {
      const stream = await getUserMedia();
      const videoTrack = stream.getVideoTracks()[0];
      const sender = peerConnectionRef.current.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );

      if (sender) {
        await sender.replaceTrack(videoTrack);
      }

      setIsScreenSharing(false);
      socketRef.current.emit('screen-share-stop', { roomId });

    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  };

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading interview...</div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Interview not found</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Please login to join the call</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{interview.title}</h1>
          <p className="text-gray-400">{interview.name} - {interview.role}</p>
        </div>
        <div className="flex items-center gap-4">
          {isCallActive && (
            <div className="bg-green-600 px-3 py-1 rounded-full text-sm">
              {formatDuration(callDuration)}
            </div>
          )}
          <div className="text-sm text-gray-400">
            Status: {connectionState}
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="relative h-screen-minus-header">
        {/* Remote Video (Main) */}
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <Users size={64} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Waiting for other participant...</p>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-64 h-48 bg-gray-700 rounded-lg overflow-hidden">
          {localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <VideoIcon size={32} className="text-gray-500" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
            You
          </div>
        </div>

        {/* Screen Share Indicator */}
        {isScreenSharing && (
          <div className="absolute top-4 left-4 bg-blue-600 px-3 py-1 rounded-full text-sm">
            Screen Sharing
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 p-4">
        <div className="flex justify-center items-center gap-4">
          {/* Start/Join Call - Only Admin can start, User can only join */}
          {!callStarted ? (
            user.role === 'admin' ? (
              <button
                onClick={handleStartCall}
                className="bg-green-600 hover:bg-green-700 p-4 rounded-full transition"
                title="Start Call"
              >
                <Phone size={24} />
              </button>
            ) : (
              <button
                onClick={handleJoinCall}
                className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full transition"
                title="Join Call"
                disabled={!participants.some(p => p.role === 'admin')}
              >
                <Phone size={24} />
              </button>
            )
          ) : (
            <>
              {/* Mute Toggle */}
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              {/* Video Toggle */}
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition ${
                  isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isVideoOff ? <VideoOff size={24} /> : <VideoIcon size={24} />}
              </button>

              {/* Screen Share Toggle */}
              <button
                onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                className={`p-4 rounded-full transition ${
                  isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
              </button>

              {/* Chat Toggle */}
              <button
                onClick={() => setShowChat(!showChat)}
                className="bg-gray-600 hover:bg-gray-700 p-4 rounded-full transition"
              >
                <MessageCircle size={24} />
              </button>

              {/* End Call */}
              <button
                onClick={handleEndCall}
                className="bg-red-600 hover:bg-red-700 p-4 rounded-full transition"
              >
                <PhoneOff size={24} />
              </button>
            </>
          )}
        </div>

        {/* Call Info */}
        <div className="text-center mt-2 text-sm text-gray-400">
          {!callStarted ? (
            <p>Click to join the interview call</p>
          ) : (
            <p>
              {remoteStream ? 'Connected' : 'Connecting...'} • 
              Room: {roomId.slice(0, 8)}...
            </p>
          )}
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && interview && (
        <div className="fixed right-0 top-0 h-full w-96 bg-gray-800 border-l border-gray-700 z-50">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold">Interview Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="h-full pb-16">
            <ChatBox 
              interviewId={interview._id} 
              interview={interview}
            />
          </div>
        </div>
      )}

      {/* Incoming Call Modal */}
      {isRinging && incomingCall && (
        <IncomingCallModal
          caller={incomingCall.caller}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}
    </div>
  );
}
