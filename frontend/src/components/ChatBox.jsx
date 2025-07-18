import React, { useState, useEffect } from 'react';

export default function ChatBox({ socket, roomId, userName }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!socket) return;

    socket.on('chat-message', ({ sender, message }) => {
      setMessages(prev => [...prev, { sender, message }]);
    });

    return () => socket.off('chat-message');
  }, [socket]);

  const handleSend = () => {
    if (msg.trim()) {
      socket.emit('chat-message', {
        roomId,
        sender: userName || 'Anonymous',
        message: msg
      });
      setMessages(prev => [...prev, { sender: 'You', message: msg }]);
      setMsg('');
    }
  };

  return (
    <div className="border-l p-4 w-1/4 bg-white overflow-y-auto h-full">
      <h3 className="font-bold mb-2">Chat</h3>
      <div className="h-80 overflow-y-scroll border p-2 mb-2 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.sender}:</strong> {m.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="flex-1 border px-2 rounded"
          placeholder="Type your message"
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-3 py-1 rounded">Send</button>
      </div>
    </div>
  );
}
