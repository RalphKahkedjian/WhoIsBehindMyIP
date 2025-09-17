import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { LobbyContext } from '../context/lobbyContext'

const socket = io("http://localhost:3001");

export default function useLobbyController() {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const {
    lobby, setLobby,
    lobbyCode, setLobbyCode,
    username, setUsername,
    inLobby, setInLobby,
    isNewLobby, setIsNewLobby
  } = useContext(LobbyContext);

  useEffect(() => {
    socket.on('lobbyUpdate', (updatedLobby) => {
      setLobby(updatedLobby);
      if (updatedLobby.players.length === 6) {
        setTimeout(() => navigate('/gameboard'), 2000);
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
  };

  return {
    lobbyCode, setLobbyCode,
    username, setUsername,
    inLobby, isNewLobby, lobby,
    audioRef,
    handleCreateLobby, handleJoinLobby, handleLeaveLobby, toggleMute
  };
}
