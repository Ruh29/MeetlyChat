import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/authSlice';
import { io } from 'socket.io-client';
import IncomingCallModal from './IncomingCallModal';

export default function GlobalCallManager() {
  const user = useSelector(selectUser);
  const socketRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Initialize global socket connection for call notifications
    socketRef.current = io('http://localhost:8000');
    const socket = socketRef.current;

    // Listen for incoming calls globally
    socket.on('incoming-call', ({ caller, roomId }) => {
      console.log('Incoming call from:', caller);
      setIncomingCall({ caller, roomId });
      setIsRinging(true);
    });

    // Join user to their personal notification room
    socket.emit('join-user-room', { userId: user._id || user.id, user });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const acceptCall = () => {
    setIsRinging(false);
    if (incomingCall) {
      // Open video call in new window/tab
      const callUrl = `${window.location.origin}/call/${incomingCall.roomId}`;
      window.open(callUrl, '_blank', 'width=1200,height=800');
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
