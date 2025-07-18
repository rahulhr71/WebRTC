import React, { useState } from 'react';

export default function Controls({ localStream, onLeave, socket }) {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState(null);

  const handleToggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace track in peer connection
        const sender = window.peerConnection.getSenders().find(s => s.track.kind === 'video');
        sender.replaceTrack(screenTrack);

        // Optional: update local preview
        if (window.localVideoRef) {
          window.localVideoRef.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          handleToggleScreenShare(); // auto-stop when screen share ends
        };

        setScreenTrack(screenTrack);
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Screen sharing failed', err);
      }
    } else {
      const cameraStream = localStream.getVideoTracks()[0];
      const sender = window.peerConnection.getSenders().find(s => s.track.kind === 'video');
      sender.replaceTrack(cameraStream);

      if (window.localVideoRef) {
        window.localVideoRef.srcObject = localStream;
      }

      if (screenTrack) {
        screenTrack.stop();
      }

      setIsScreenSharing(false);
    }
  };

  return (
    <div className="flex gap-4 mt-4">
      <button onClick={handleToggleScreenShare} className="bg-purple-600 text-white px-4 py-2 rounded">
        {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
      </button>
      <button onClick={onLeave} className="bg-red-500 text-white px-4 py-2 rounded">Leave</button>
    </div>
  );
}
