import React, { useState, useEffect, useRef } from 'react';

export default function Chat({ socket, roomId, username }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('send-message', {
      roomId,
      sender: username || 'Guest',
      message,
    });
    setMessage('');
  };

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-xl shadow-md w-full md:w-[400px] h-[400px] flex flex-col p-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-2">Group Chat</h2>
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm">
            <strong>{msg.sender}:</strong> {msg.message}
            <span className="text-xs text-gray-400 ml-2">{msg.time}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l px-2 py-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 py-1 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}
