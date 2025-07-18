import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Controls from '../components/Controls';
import VideoGrid from '../components/VideoGrid';

const socket = io('https://your-render-url.onrender.com');

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit('join', roomId);
        // TODO: Handle offer/answer exchange via socket
      })
      .catch(err => {
        console.error('Error accessing camera', err);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2 className="text-center text-2xl my-2">Meeting ID: {roomId}</h2>
      <VideoGrid localVideoRef={localVideoRef} />
      <Controls localStream={localStream} onLeave={() => navigate('/')} />
    </div>
  );
}
