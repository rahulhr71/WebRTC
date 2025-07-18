import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoinMeeting = async () => {
    if (!roomId.trim()) {
      alert('Please enter a meeting ID');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;

    peerConnection.current = new RTCPeerConnection();

    stream.getTracks().forEach(track =>
      peerConnection.current.addTrack(track, stream)
    );

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
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

      {!joined && (
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter Meeting ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ padding: '0.5rem', width: '200px' }}
          />
          <br />
          <button
            onClick={handleJoinMeeting}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Join Meeting
          </button>
        </div>
      )}

      {joined && (
        <div>
          <p><strong>Meeting ID:</strong> {roomId}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <div>
              <h3>Local Video</h3>
              <video ref={localVideoRef} autoPlay muted playsInline width="300" style={{ border: '2px solid green' }} />
            </div>
            <div>
              <h3>Remote Video</h3>
              <video ref={remoteVideoRef} autoPlay playsInline width="300" style={{ border: '2px solid blue' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
