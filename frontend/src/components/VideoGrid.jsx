import React from 'react';

export default function VideoGrid({ localVideoRef, remoteVideos }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 w-full max-w-7xl mx-auto">
      {/* Local video */}
      <div className="bg-black rounded overflow-hidden">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <p className="text-white text-sm text-center mt-1">You</p>
      </div>

      {/* Remote videos */}
      {remoteVideos.map(({ id, ref }) => (
        <div key={id} className="bg-black rounded overflow-hidden">
          <video
            ref={ref}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <p className="text-white text-sm text-center mt-1">User: {id}</p>
        </div>
      ))}
    </div>
  );
}
