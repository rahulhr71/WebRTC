import React, { useState } from 'react';

export default function Controls({ localStream, onLeave }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const toggleMic = () => {
    const audioTrack = localStream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleCam = () => {
    const videoTrack = localStream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCamOn(videoTrack.enabled);
    }
  };

  return (
    <div className="flex justify-center gap-6 mt-4">
      <button onClick={toggleMic} className="px-4 py-2 bg-blue-500 text-white rounded-xl">
        {micOn ? 'Mute Mic' : 'Unmute'}
      </button>
      <button onClick={toggleCam} className="px-4 py-2 bg-green-500 text-white rounded-xl">
        {camOn ? 'Stop Camera' : 'Start Camera'}
      </button>
      <button onClick={onLeave} className="px-4 py-2 bg-red-600 text-white rounded-xl">
        Leave Meeting
      </button>
    </div>
  );
}
