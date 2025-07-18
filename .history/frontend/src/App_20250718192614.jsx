import { Routes, Route, useNavigate } from 'react-router-dom';
import Room from './pages/Room';
import { useState } from 'react';

export default function App() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleJoin = () => {
    if (!roomId.trim()) return;
    navigate(`/room/${roomId}`);
  };
  const createRoom = () => {
  const newRoomId = uuidv4(); // or nanoid
  socket.emit('create-room', { roomId: newRoomId, password });
  navigate(`/room/${newRoomId}`);
};
const joinRoom = () => {
  socket.emit('join-room', { roomId, password });

  socket.on('join-response', (res) => {
    if (res.success) {
      navigate(`/room/${roomId}`);
    } else {
      setError(res.message);
    }
  });
};

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl mb-4">Simple Meet </h1>
      <input type="text" placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} />
<input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
<button onClick={joinRoom}>Join Meeting</button>
<button onClick={createRoom}>Create Meeting</button>
{error && <p className="text-red-600">{error}</p>}

      <Routes>
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>
  );
}
