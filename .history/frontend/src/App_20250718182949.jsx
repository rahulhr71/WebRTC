import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('https://webrtc-thrz.onrender.com');

function App() {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  const [joined, setJoined] = useState(false);

  const handleJoinMeeting = async () => {
    setJoined(true); // Render videos first

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    peerConnection.current = new RTCPeerConnection();

    stream.getTracks().forEach(track =>
      peerConnection.current.addTrack(track, stream)
    );

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      }
    };

    socket.emit('join', roomId);
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

      {/* Always render video elements so refs exist */}
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

      {!joined && (
        <button
          onClick={handleJoinMeeting}
          style={{
            marginTop: '1.5rem',
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
    </div>
  );
}

export default App;
