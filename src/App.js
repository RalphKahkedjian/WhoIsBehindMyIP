import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import background from './images/background.gif';
import backgroundMusic from './sounds/backgroundmusic.mp3';
import githubIcon from './images/github.png';
import linkedinIcon from './images/linkedin.png';
import './App.css';

const socket = io("http://localhost:3001"); // connect to backend

export default function App() {
  const [lobbyCode, setLobbyCode] = useState('');
  const [username, setUsername] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [lobby, setLobby] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // listen for lobby updates
    socket.on("lobbyUpdate", (updatedLobby) => {
      setLobby(updatedLobby);
    });

    socket.on("errorMessage", (msg) => {
      alert(msg);
    });

    socket.on("lobbyDeleted", (lobbyId) => {
      if (lobby?.lobbyId === lobbyId) {
        setLobby(null);
      }
    });

    return () => {
      socket.off("lobbyUpdate");
      socket.off("errorMessage");
      socket.off("lobbyDeleted");
    };
  }, [lobby]);

  const handleCreateLobby = () => {
    if (!lobbyCode.trim() || !username.trim()) {
      alert("Enter a username and lobby code to create.");
      return;
    }
    socket.emit("createLobby", { lobbyId: lobbyCode, playerName: username });
  };

  const handleJoinLobby = () => {
    if (!lobbyCode.trim() || !username.trim()) {
      alert("Enter a username and lobby code to join.");
      return;
    }
    socket.emit("joinLobby", { lobbyId: lobbyCode, playerName: username });
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100vh' }}>
      {/* Background image */}
      <img
        src={background}
        alt="Background"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Background music */}
      <audio ref={audioRef} src={backgroundMusic} autoPlay loop muted />

      {/* Mute button */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '0.6rem 1.2rem',
          fontSize: '1rem',
          border: '2px solid #e84ee8',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.6)',
          color: '#fff',
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>

{/* Title + Inputs Container */}
<div
  style={{
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    padding: '0 1rem', // some padding for small screens
  }}
>
  {/* Title */}
  <h3
  className='zoom-title'
    style={{
      color: '#fff',
      fontSize: '2.6rem',
      transform:'scale(1.2)',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      textShadow: '2px 2px 8px rgba(232, 78, 232, 0.7)',
      textAlign: 'center',
      marginBottom:'70px',
      whiteSpace:'wrap',
      width:'85%'
    }}
  >
    Defend Your IP
  </h3>
  {/* Inputs */}
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
      width: '100%',
      maxWidth: '300px', // keep inputs from being too wide on desktop
    }}
  >

    {/* Lobby Code */}
    <input
      type="text"
      placeholder="Enter Lobby Code"
      value={lobbyCode}
      onChange={(e) => setLobbyCode(e.target.value)}
      style={{
        padding: '0.8rem 1rem',
        fontSize: '1.2rem',
        border: '2px solid #e84ee8',
        borderRadius: '5px',
        outline: 'none',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        textAlign: 'center',
        width: '100%',
        fontFamily: 'monospace',
      }}
    />

          {/* Username */}
    <input
      type="text"
      placeholder="Enter Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      style={{
        padding: '0.8rem 1rem',
        fontSize: '1.2rem',
        border: '2px solid #e84ee8',
        borderRadius: '5px',
        outline: 'none',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        textAlign: 'center',
        width: '100%',
        fontFamily: 'monospace',
      }}
    />


    {/* Buttons */}
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'nowrap', justifyContent: 'center' }}>
      <button
        onClick={handleJoinLobby}
        style={{
          padding: '.6rem 2rem',
          fontSize: '1.2rem',
          border: '2px solid #e84ee8',
          borderRadius: '5px',
          background: 'rgba(232, 78, 232, 0.7)',
          color: '#fff',
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        Join Lobby
      </button>
      <button
        onClick={handleCreateLobby}
        style={{
          padding: '0.6rem 2rem',
          fontSize: '1.2rem',
          border: '2px solid #e84ee8',
          borderRadius: '5px',
          background: 'rgba(232, 78, 232, 0.7)',
          color: '#fff',
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        Create Lobby
      </button>
    </div>
  </div>
</div>


      {/* Lobby Info */}
      {lobby && (
        <div
          style={{
            position: 'absolute',
            top: '65%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            fontFamily: 'monospace',
            textAlign: 'center',
          }}
        >
          <h4>Lobby: {lobbyCode}</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {lobby.players.map((p) => (
              <li key={p.id}>
                {p.name} ({p.role})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#e84ee8ba',
          position: 'absolute',
          bottom: 0,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '5px',
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
        }}
      >
        <div></div>
        <div>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '1.2em',
              letterSpacing: '1px',
            }}
          >
            &copy; 2025 Ralph Kahkedjian
          </p>
        </div>
        <div
          style={{
            marginRight: '30px',
            display: 'flex',
            gap: '10px',
          }}
        >
          <a href="https://github.com/RalphKahkedjian">
            <img src={githubIcon} width={40} height={40} alt="GitHub" />
          </a>
          <a href="https://www.linkedin.com/in/ralph-kahkedjian-b88361336/">
            <img src={linkedinIcon} width={40} height={40} alt="LinkedIn" />
          </a>
        </div>
      </div>
    </div>
  );
}
