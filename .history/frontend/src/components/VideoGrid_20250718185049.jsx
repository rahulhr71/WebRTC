export default function VideoGrid({ localVideoRef, remoteVideoRef }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <video ref={localVideoRef} autoPlay muted className="rounded shadow h-64 object-cover" />
      <video ref={remoteVideoRef} autoPlay className="rounded shadow h-64 object-cover" />
      {/* Add more remote videos dynamically if you implement multiple users */}
    </div>
  );
}
