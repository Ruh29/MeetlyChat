import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/authSlice';
import { io } from 'socket.io-client';
import IncomingCallModal from './IncomingCallModal';

export default function RealTimeCallManager() {
  const user = useSelector(selectUser);
  const socketRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection for real-time notifications
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5004', {
      transports: ['websocket', 'polling']
    });
    const socket = socketRef.current;

    // Listen for incoming calls from any room
    socket.on('incoming-call', ({ caller, roomId }) => {
      console.log('🔔 Incoming call received from:', caller, 'Room:', roomId);
      
      // Only show notification if it's not from the same user
      if (caller.email !== user.email) {
        setIncomingCall({ caller, roomId });
        setIsRinging(true);
        
        // Play notification sound
        playNotificationSound();
      }
    });

    // Connect and identify user
    socket.on('connect', () => {
      console.log('🟢 Connected to real-time call system');
      // Join user-specific room for targeted notifications
      socket.emit('join-user-room', { 
        userId: user._id || user.id || user.email, 
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected from real-time call system');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const playNotificationSound = () => {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const playBeep = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      };

      // Play notification pattern
      playBeep();
      setTimeout(playBeep, 600);
    } catch (error) {
      console.log('Audio notification error:', error);
    }
  };

  const acceptCall = () => {
    setIsRinging(false);
    if (incomingCall) {
      // Only users can accept calls, admin starts them
      if (user.role !== 'admin') {
        // Notify caller that call was accepted
        if (socketRef.current) {
          socketRef.current.emit('call-accepted', { 
            roomId: incomingCall.roomId,
            acceptedBy: user 
          });
        }
      }
      
      // Navigate to call room
      const callUrl = `/call/${incomingCall.roomId}`;
      window.location.href = callUrl;
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    setIsRinging(false);
    setIncomingCall(null);
    // Notify caller of rejection
    if (socketRef.current && incomingCall) {
      socketRef.current.emit('call-rejected', { 
        roomId: incomingCall.roomId,
        rejectedBy: user 
      });
    }
  };

  // Only render modal if there's an incoming call
  if (!isRinging || !incomingCall) {
    return null;
  }

  return (
    <IncomingCallModal
      caller={incomingCall.caller}
      onAccept={acceptCall}
      onReject={rejectCall}
    />
  );
}
