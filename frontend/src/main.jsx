import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import './index.css';
import { v4 as uuidv4 } from 'uuid';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home: Redirect to random room */}
        <Route path="/" element={<Navigate to={`/room/${uuidv4()}`} />} />

        {/* Room with ID */}
        <Route path="/room/:roomId" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
