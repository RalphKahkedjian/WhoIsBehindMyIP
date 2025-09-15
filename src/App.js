import { useState, useRef } from 'react';
import background from './images/background.gif';
import backgroundMusic from './sounds/backgroundmusic.mp3';
import githubIcon from './images/github.png';
import linkedinIcon from './images/linkedin.png';
import './App.css';

export default function App() {
  const [lobbyCode, setLobbyCode] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  const handleJoinLobby = () => {
    if (lobbyCode.trim() !== '') {
      alert(`Joining lobby: ${lobbyCode}`);
    } else {
      alert('Please enter a lobby code.');
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100vh' }}>
      {/* Background-immage */}
      <img
        src={background}
        alt="Background"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Background music */}
      <audio ref={audioRef} src={backgroundMusic} autoPlay loop muted />

      {/*mute-unmure button*/}
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
          transition: '0.3s',
        }}
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>

      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#fff',
          fontSize: '3rem',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          textShadow: '2px 2px 8px rgba(232, 78, 232, 0.7)',
          textAlign: 'center',
        }}
      >
        <h3>Who's Behind My IP?</h3>
      </div>

      
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
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
            width: '250px',
            fontFamily: 'monospace',
          }}
        />
        <button
          onClick={handleJoinLobby}
          style={{
            padding: '0.8rem 2rem',
            fontSize: '1.2rem',
            border: '2px solid #e84ee8',
            borderRadius: '5px',
            background: 'rgba(232, 78, 232, 0.7)',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'monospace',
            transition: '0.3s',
          }}
        >
          Join Lobby
        </button>
        <button
          onClick={handleJoinLobby}
          style={{
            padding: '0.8rem 2rem',
            fontSize: '1.2rem',
            border: '2px solid #e84ee8',
            borderRadius: '5px',
            background: 'rgba(232, 78, 232, 0.7)',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'monospace',
            transition: '0.3s',
          }}
        >
          Create Lobby
        </button>
      </div>

      {/* footer */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#e84ee8ba',
          position: 'absolute',
          bottom: 0,
          display: 'flex',
          justifyContent: 'space-between',
          textAlign: 'center',
          padding: '5px 5px 5px 5px',
          borderTopLeftRadius: '30px',
          borderTopRightRadius: '30px',
        }}
      >
        <div></div>
        <div>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '1.36em',
              letterSpacing: '1',
            }}
          >
            &copy; 2025 Ralph Kahkedjian
          </p>
        </div>
        <div
          style={{
            marginRight: '30px',
            marginTop: '5px',
            display: 'flex',
            gap: '10px',
          }}
          id="socials"
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
