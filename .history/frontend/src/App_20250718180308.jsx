import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Your signaling server URL
const roomId = 'test-room';

function App() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [streamReady, setStreamReady] = useState(false);

  useEffect(() => {
    async function startMedia() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      setStreamReady(true);

      peerConnection.current = new RTCPeerConnection();

      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { roomId, candidate: event.candidate });
        }
      };

      socket.emit('join', roomId);
    }

    startMedia();

    socket.on('user-joined', async () => {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer });
    });

    socket.on('offer', async ({ offer }) => {
      await peerConnection.current.setRemoteDescription(offer);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', { roomId, answer });
    });

    socket.on('answer', async ({ answer }) => {
      await peerConnection.current.setRemoteDescription(answer);
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      await peerConnection.current.addIceCandidate(candidate);
    });

    return () => {
      socket.disconnect();
      peerConnection.current?.close();
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>🔴 WebRTC with Vite + React</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <div>
          <h3>Local</h3>
          <video ref={localVideoRef} autoPlay muted playsInline width="300" style={{ border: '2px solid green' }} />
        </div>
        <div>
          <h3>Remote</h3>
          <video ref={remoteVideoRef} autoPlay playsInline width="300" style={{ border: '2px solid blue' }} />
        </div>
      </div>
    </div>
  );
}

export default App;
