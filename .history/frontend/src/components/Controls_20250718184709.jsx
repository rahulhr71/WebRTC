export default function Controls({ localStream, onLeave }) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const toggleMic = () => {
    localStream.getAudioTracks()[0].enabled = !isMicOn;
    setIsMicOn(!isMicOn);
  };

  const toggleCamera = () => {
    localStream.getVideoTracks()[0].enabled = !isCameraOn;
    setIsCameraOn(!isCameraOn);
  };

  // ... your screen sharing and leave logic ...

  return (
    <div className="flex gap-4 mt-4 flex-wrap">
      <button onClick={toggleMic} className="bg-blue-500 text-white px-4 py-2 rounded">
        {isMicOn ? 'Mute Mic' : 'Unmute Mic'}
      </button>
      <button onClick={toggleCamera} className="bg-blue-500 text-white px-4 py-2 rounded">
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
      <button onClick={handleToggleScreenShare} className="bg-purple-600 text-white px-4 py-2 rounded">
        {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
      </button>
      <button onClick={onLeave} className="bg-red-500 text-white px-4 py-2 rounded">Leave</button>
    </div>
  );
}
