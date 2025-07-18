import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initWebRTC, createOffer } from '../utils/webrtc';
import Controls from '../components/Controls';
import VideoGrid from '../components/VideoGrid';

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const socket = initWebRTC(stream, roomId, (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        socket.emit('join', roomId);

        socket.on('user-joined', () => {
          createOffer(roomId);
        });

      })
      .catch(err => {
        console.error('Media error:', err);
      });

  }, []);

  return (
    <div>
      <h2 className="text-center text-2xl my-2">Meeting ID: {roomId}</h2>
      <VideoGrid localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef} />
      <Controls localStream={localStream} onLeave={() => navigate('/')} />
    </div>
  );
}
