import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
};

export const useWebRTC = (roomId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionState, setConnectionState] = useState('new');
  const [callDuration, setCallDuration] = useState(0);

  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callStartTimeRef = useRef(null);
  const durationIntervalRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:5002');
    
    socketRef.current.on('user-joined', handleUserJoined);
    socketRef.current.on('user-left', handleUserLeft);
    socketRef.current.on('offer', handleOffer);
    socketRef.current.on('answer', handleAnswer);
    socketRef.current.on('ice-candidate', handleIceCandidate);
    socketRef.current.on('screen-share-started', handleScreenShareStarted);
    socketRef.current.on('screen-share-stopped', handleScreenShareStopped);
    socketRef.current.on('call-ended', handleCallEnded);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Start call duration tracking
  const startCallTimer = useCallback(() => {
    callStartTimeRef.current = Date.now();
    durationIntervalRef.current = setInterval(() => {
      if (callStartTimeRef.current) {
        setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
      }
    }, 1000);
  }, []);

  // Stop call duration tracking
  const stopCallTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    callStartTimeRef.current = null;
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          roomId,
          candidate: event.candidate
        });
      }
    };

    peerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.onconnectionstatechange = () => {
      setConnectionState(peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        if (!callStartTimeRef.current) {
          startCallTimer();
        }
      } else if (peerConnection.connectionState === 'disconnected' || 
                 peerConnection.connectionState === 'failed') {
        stopCallTimer();
      }
    };

    return peerConnection;
  }, [roomId, startCallTimer, stopCallTimer]);

  // Get user media
  const getUserMedia = useCallback(async (video = true, audio = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 1280, height: 720 } : false,
        audio: audio
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  // Start call
  const startCall = useCallback(async () => {
    try {
      const stream = await getUserMedia();
      setIsCallActive(true);
      
      peerConnectionRef.current = createPeerConnection();
      
      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // Join room
      socketRef.current.emit('joinRoom', roomId);

    } catch (error) {
      console.error('Error starting call:', error);
      setIsCallActive(false);
    }
  }, [roomId, getUserMedia, createPeerConnection]);

  // End call
  const endCall = useCallback(() => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Leave room
    socketRef.current.emit('leaveRoom', roomId);
    socketRef.current.emit('call-ended', { roomId });

    // Reset states
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setIsScreenSharing(false);
    setConnectionState('new');
    stopCallTimer();
    setCallDuration(0);
  }, [localStream, roomId, stopCallTimer]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, [localStream]);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
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
  }, [roomId]);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
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
  }, [roomId, getUserMedia]);

  // Socket event handlers
  const handleUserJoined = useCallback(async ({ userId }) => {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = createPeerConnection();
      
      if (localStream) {
        localStream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, localStream);
        });
      }
    }

    // Create and send offer
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    
    socketRef.current.emit('offer', {
      roomId,
      offer,
      targetId: userId
    });
  }, [roomId, localStream, createPeerConnection]);

  const handleUserLeft = useCallback(() => {
    setRemoteStream(null);
    setConnectionState('disconnected');
  }, []);

  const handleOffer = useCallback(async ({ offer, senderId }) => {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = createPeerConnection();
      
      if (localStream) {
        localStream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, localStream);
        });
      }
    }

    await peerConnectionRef.current.setRemoteDescription(offer);
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socketRef.current.emit('answer', {
      roomId,
      answer,
      targetId: senderId
    });
  }, [roomId, localStream, createPeerConnection]);

  const handleAnswer = useCallback(async ({ answer }) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(answer);
    }
  }, []);

  const handleIceCandidate = useCallback(async ({ candidate }) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(candidate);
    }
  }, []);

  const handleScreenShareStarted = useCallback(() => {
    // Handle remote screen share started
  }, []);

  const handleScreenShareStopped = useCallback(() => {
    // Handle remote screen share stopped
  }, []);

  const handleCallEnded = useCallback(() => {
    endCall();
  }, [endCall]);

  return {
    localStream,
    remoteStream,
    isCallActive,
    isScreenSharing,
    isMuted,
    isVideoOff,
    connectionState,
    callDuration,
    localVideoRef,
    remoteVideoRef,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare
  };
};
