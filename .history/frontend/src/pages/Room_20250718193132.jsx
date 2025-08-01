import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initWebRTC, createOffer } from '../utils/webrtc';
import Controls from '../components/Controls';
import VideoGrid from '../components/VideoGrid';
import Chat from '../components/Chat';
import ChatBox from '../components/ChatBox';
import ParticipantList from '../components/ParticipantList';
export default function Room() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [participants, setParticipants] = useState([]);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        window.localVideoRef = localVideoRef.current;
    }, []);
    useEffect(() => {
        if (!socket) return;
        socket.on('participants', (ids) => {
            setParticipants(ids);
        });
        return () => socket.off('participants');
    }, [socket]);
    useEffect(() => {
        if (!socket) return;

        socket.on('room-ended', () => {
            alert("The host has ended the meeting.");
            navigate('/');
        });

        return () => {
            socket.off('room-ended');
        };
    }, [socket]);
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;

                const s = initWebRTC(stream, roomId, (remoteStream) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                });

                setSocket(s);
                s.emit('join', roomId);
                s.on('user-joined', () => createOffer(roomId));
            })
            .catch(console.error);
    }, []);
    const handleNewRemoteStream = (id, stream) => {
        const newRef = React.createRef();
        setRemoteStreams(prev => [...prev, { id, ref: newRef }]);

        setTimeout(() => {
            if (newRef.current) {
                newRef.current.srcObject = stream;
            }
        }, 0);
    };
    const handleLeave = () => {
        socket.emit('leave-room', { roomId });
        navigate('/');
    };

    const handleEnd = () => {
        socket.emit('end-room', { roomId });
        navigate('/');
    };
    const s = initWebRTC(stream, roomId, (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
    });
    window.peerConnection = s.peerConnection;
    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col items-center">
                <h2 className="text-xl font-bold mt-2">Meeting ID: {roomId}</h2>
                <VideoGrid
                    localVideoRef={localVideoRef}
                    remoteVideos={remoteStreams}
                />
                <Controls localStream={localStream} onLeave={handleLeaveMeeting} />

            </div>
            <div className="flex gap-4 mt-4">
                <button onClick={handleLeave} className="bg-yellow-500 text-white px-4 py-2 rounded">Leave Meeting</button>
                <button onClick={handleEnd} className="bg-red-600 text-white px-4 py-2 rounded">End Meeting</button>
            </div>
            <ChatBox socket={socket} roomId={roomId} userName="User" />
            <Chat socket={socket} roomId={roomId} username={userName} />

            <ParticipantList participants={participants} />
        </div>
    );
}
