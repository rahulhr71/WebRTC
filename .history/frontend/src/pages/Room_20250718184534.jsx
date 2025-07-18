import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initWebRTC, createOffer } from '../utils/webrtc';
import Controls from '../components/Controls';
import VideoGrid from '../components/VideoGrid';
import ChatBox from '../components/ChatBox';

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);
  const [socket, setSocket] = useState(null);
useEffect(() => {
  window.localVideoRef = localVideoRef.current;
}, []);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        const s = initWebRTC(stream, roomId, (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        setSocket(s);
        s.emit('join', roomId);
        s.on('user-joined', () => createOffer(roomId));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-xl font-bold mt-2">Meeting ID: {roomId}</h2>
        <VideoGrid localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef} />
        <Controls localStream={localStream} onLeave={() => navigate('/')} />
      </div>
      <ChatBox socket={socket} roomId={roomId} userName="User" />
    </div>
  );
}
