import io from 'socket.io-client';

const socket = io('https://webrtc-thrz.onrender.com/'); // replace with your backend URL
let peerConnection;
let remoteStream;

const config = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

export function initWebRTC(localStream, roomId, onRemoteStream) {
  peerConnection = new RTCPeerConnection(config);
  remoteStream = new MediaStream();
onTrack: (peerId, remoteStream) => {
  handleNewRemoteStream(peerId, remoteStream);
}
  // Add local tracks
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // Listen for remote tracks
  peerConnection.ontrack = event => {
    event.streams[0].getTracks().forEach(track => {
      remoteStream.addTrack(track);
    });
    onRemoteStream(remoteStream);
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('ice-candidate', { candidate: event.candidate, roomId });
    }
  };

  // Handle offer/answer
  socket.on('offer', async ({ offer }) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', { answer, roomId });
  });

  socket.on('answer', async ({ answer }) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('ice-candidate', async ({ candidate }) => {
    if (candidate) {
      try {
        await peerConnection.addIceCandidate(candidate);
      } catch (e) {
        console.error('Error adding received ICE candidate', e);
      }
    }
  });

  return socket;
}

export async function createOffer(roomId) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', { offer, roomId });
}
