import React, { useState } from 'react';

export default function Controls({ localStream, onLeave }) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const toggleMic = () => {
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mt-4 justify-center">
      <button onClick={toggleMic} className="bg-blue-600 text-white px-4 py-2 rounded">
        {isMicOn ? 'Mute Mic' : 'Unmute Mic'}
      </button>

      <button onClick={toggleCamera} className="bg-yellow-500 text-white px-4 py-2 rounded">
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>

      <button onClick={onLeave} className="bg-red-500 text-white px-4 py-2 rounded">
        Leave Meeting
      </button>
    </div>
  );
}
