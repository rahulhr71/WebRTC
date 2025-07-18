import React from 'react';

export default function VideoGrid({ localVideoRef }) {
  return (
    <div className="grid grid-cols-2 gap-4 justify-center p-4">
      <video ref={localVideoRef} autoPlay playsInline muted className="rounded-xl w-full h-auto border" />
      {/* TODO: Remote videos */}
    </div>
  );
}
