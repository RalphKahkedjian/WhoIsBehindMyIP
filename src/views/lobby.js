import React from 'react';
import background from '../images/background.gif';
import backgroundMusic from '../sounds/backgroundmusic.mp3';
import githubIcon from '../images/github.png';
import linkedinIcon from '../images/linkedin.png';
import '../App.css';
import useLobbyController from '../controllers/lobbyController';

export default function Lobby() {
  const {
    lobbyCode, setLobbyCode,
    username, setUsername,
    inLobby, isNewLobby, lobby,
    isMuted, audioRef,
    handleCreateLobby, handleJoinLobby, handleLeaveLobby, toggleMute
  } = useLobbyController();

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100vh', left:'0', top:'0' }}>
      {/* Background */}
      <img src={background} alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <audio ref={audioRef} src={backgroundMusic} autoPlay loop muted />

      {/* Mute button */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute', top: '20px', right: '20px',
          padding: '0.6rem 1.2rem', fontSize: '1rem',
          border: '2px solid #e84ee8', borderRadius: '8px',
          background: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer',
          fontFamily: 'monospace'
        }}
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>

      {/* Main UI */}
      {!inLobby ? (
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', width: '90%',
          padding: '0 1rem'
        }}>
          <h3 className='zoom-title' style={{
            color: '#fff', fontSize: '2.6rem', transform: 'scale(1.2)',
            fontWeight: 'bold', fontFamily: 'monospace',
            textShadow: '2px 2px 8px rgba(232,78,232,0.7)',
            textAlign: 'center', marginBottom: '70px', width: '85%'
          }}>Defend Your IP</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                padding: '0.8rem 1rem', fontSize: '1.2rem',
                border: '2px solid #e84ee8', borderRadius: '5px',
                outline: 'none', background: 'rgba(0,0,0,0.6)',
                color: '#fff', textAlign: 'center', width: '100%',
                fontFamily: 'monospace'
              }}
            />
            <input
              type="text"
              placeholder="Enter Lobby Code"
              value={lobbyCode}
              onChange={e => setLobbyCode(e.target.value)}
              style={{
                padding: '0.8rem 1rem', fontSize: '1.2rem',
                border: '2px solid #e84ee8', borderRadius: '5px',
                outline: 'none', background: 'rgba(0,0,0,0.6)',
                color: '#fff', textAlign: 'center', width: '100%',
                fontFamily: 'monospace'
              }}
            />
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <button
                onClick={handleJoinLobby}
                style={{
                  padding: '.6rem 2rem', fontSize: '1.2rem',
                  border: '2px solid #e84ee8', borderRadius: '5px',
                  background: 'rgba(232,78,232,0.7)', color: '#fff',
                  cursor: 'pointer', fontFamily: 'monospace'
                }}
              >
                Join Lobby
              </button>
              <button
                onClick={handleCreateLobby}
                style={{
                  padding: '.6rem 2rem', fontSize: '1.2rem',
                  border: '2px solid #e84ee8', borderRadius: '5px',
                  background: 'rgba(232,78,232,0.7)', color: '#fff',
                  cursor: 'pointer', fontFamily: 'monospace'
                }}
              >
                Create Lobby
              </button>
            </div>
          </div>
        </div>
      ) : lobby ? (
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)', color: '#fff',
          fontFamily: 'monospace', textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3.5em', fontFamily: 'monospace' }}>
            {isNewLobby ? 'Created Lobby, waiting for players...' : 'Joined Lobby, waiting for players...'}
          </h1>
          <p>Code: {lobbyCode}</p>
          <p style={{ fontFamily: 'monospace', fontSize: '1.3em' }}>Status: {lobby.status}</p>
          <p>{lobby.players.length} / 6 players</p>
          <button
            onClick={handleLeaveLobby}
            style={{
              padding: '.6rem 2rem', fontSize: '1rem',
              border: '2px solid #e84ee8', borderRadius: '5px',
              background: 'rgba(232,78,232,0.7)', color: '#fff',
              cursor: 'pointer', fontFamily: 'monospace'
            }}
          >
            Cancel / Leave Lobby
          </button>
        </div>
      ) : (
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)', color: '#fff',
          fontFamily: 'monospace', textAlign: 'center'
        }}>
          <h1>Joining lobby...</h1>
        </div>
      )}

      {/* Footer */}
      <div style={{
        width: '100%', backgroundColor: '#e84ee8ba',
        position: 'absolute', bottom: 0, display: 'flex',
        justifyContent: 'space-between', padding: '5px',
        borderTopLeftRadius: '30px', borderTopRightRadius: '30px'
      }}>
        <div></div>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '1.2em', letterSpacing: '1px' }}>
            &copy; 2025 Ralph Kahkedjian
          </p>
        </div>
        <div style={{ marginRight: '30px', display: 'flex', gap: '10px' }}>
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
