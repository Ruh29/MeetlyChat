import React from 'react';
import { useParams } from 'react-router-dom';
import VideoCall from '../components/VideoCall';

export default function CallPage() {
  const { roomId } = useParams();
  
  return <VideoCall roomId={roomId} />;
}
