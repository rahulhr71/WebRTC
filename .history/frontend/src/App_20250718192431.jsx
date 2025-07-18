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

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl mb-4">Simple Google Meet Clone</h1>
      <input
        type="text"
        placeholder="Enter Meeting ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="p-2 rounded border mr-2"
      />
      <button onClick={handleJoin} className="bg-blue-600 text-white px-4 py-2 rounded">
        Join Meeting
      </button>

      <Routes>
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>
  );
}
