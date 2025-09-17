import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'; // make sure to import as { io }

const socket = io("http://localhost:3001"); // <-- create a single socket instance

export default function useLobbyController() {
  const [lobbyCode, setLobbyCode] = useState('');
  const [username, setUsername] = useState('');
  const [inLobby, setInLobby] = useState(false);
  const [isNewLobby, setIsNewLobby] = useState(false);
  const [lobby, setLobby] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('lobbyUpdate', (updatedLobby) => {
      setLobby(updatedLobby);
      if (updatedLobby.players.length === 6) {
        setTimeout(() => navigate('/gameboard'), 5000);
      }
    });

    socket.on('errorMessage', (msg) => {
      alert(msg);
      setInLobby(false);
    });

    socket.on('lobbyDeleted', (deletedLobbyId) => {
      if (lobby?.id === deletedLobbyId) {
        setLobby(null);
        setInLobby(false);
      }
    });

    return () => {
      socket.off('lobbyUpdate');
      socket.off('errorMessage');
      socket.off('lobbyDeleted');
    };
  }, [lobby, navigate]);

  const handleCreateLobby = () => {
    if (!lobbyCode.trim() || !username.trim()) return alert('Enter a username and lobby code');
    socket.emit('createLobby', { lobbyId: lobbyCode, playerName: username });
    setInLobby(true);
    setIsNewLobby(true);
  };

  const handleJoinLobby = () => {
    if (!lobbyCode.trim() || !username.trim()) return alert('Enter a username and lobby code');
    socket.emit('joinLobby', { lobbyId: lobbyCode, playerName: username });
    setInLobby(true);
    setIsNewLobby(false);
  };

  const handleLeaveLobby = () => {
    setLobby(null);
    setInLobby(false);
    setLobbyCode('');
    setUsername('');
    setIsNewLobby(false);
  };

  const toggleMute = () => {
    if (audioRef.current) audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  return {
    lobbyCode, setLobbyCode,
    username, setUsername,
    inLobby, isNewLobby, lobby,
    isMuted, audioRef,
    handleCreateLobby, handleJoinLobby, handleLeaveLobby, toggleMute
  };
}
