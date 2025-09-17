import React, { useContext } from 'react';
import { LobbyContext } from '../context/lobbyContext';

export default function Gameboard() {
  const { lobby } = useContext(LobbyContext);

  if (!lobby) return <div>No lobby data found.</div>;

  return (
    <div style={{ padding: '0rem', fontFamily: 'monospace', color: '#6b1b6bc1'}}>
      <p style={{
          fontFamily: 'monospace',
          fontSize:'2em'
      }}>Lobby Code: {lobby.id}</p>

      {/* Players Table (top-right) */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '1rem',
          border: '2px solid #e84ee8',
          borderRadius: '8px',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          fontFamily: 'monospace',
        }}
      >
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #e84ee8' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #e84ee8' }}>IP</th>
            </tr>
          </thead>
          <tbody>
            {lobby.players.map(player => (
              <tr key={player.sessionId}>
                <td style={{ padding: '4px 8px' }}>{player.displayName}</td>
                <td style={{ padding: '4px 8px' }}>{player.fakeIp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{
        position:'absolute',
        bottom:'0',
        right:'0',
        padding:'2em 2em 1em 0 '
      }}>
          <button
            style={{
                padding: '0.6rem 1.2rem', fontSize: '1rem',
                border: '2px solid #e84ee8', borderRadius: '8px',
                background: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              Leave Game
        </button>
      </div>
    </div>
  );
}
