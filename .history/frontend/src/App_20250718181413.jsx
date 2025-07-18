import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // your signaling server

function App() {
  const { roomId } = useParams(); // gets room from URL
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [joined, setJoined] = useState(false);

  const handleJoinMeeting = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;

    peerConnection.current = new RTCPeerConnection();

    stream.getTracks().forEach(track =>
      peerConnection.current.addTrack(track, stream)
    );

    peerConnection.current.ontrack = event => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      }
    };

    socket.emit('join', roomId);
    setJoined(true);
  };

  useEffect(() => {
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
  }, [roomId]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🔴 WebRTC Video Meeting</h1>
      <p><strong>Meeting ID:</strong> {roomId}</p>

      {!joined && (
        <button
          onClick={handleJoinMeeting}
          style={{
            marginTop: '1rem',
            padding: '0.7rem 2rem',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
          }}
        >
          Join Meeting
        </button>
      )}

      {joined && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '2rem' }}>
          <div>
            <h3>Local Video</h3>
            <video ref={localVideoRef} autoPlay muted playsInline width="300" style={{ border: '2px solid green' }} />
          </div>
          <div>
            <h3>Remote Video</h3>
            <video ref={remoteVideoRef} autoPlay playsInline width="300" style={{ border: '2px solid blue' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
