import React, { createContext, useState } from 'react';

export const LobbyContext = createContext();

export const LobbyProvider = ({ children }) => {
  const [lobby, setLobby] = useState(null);
  const [lobbyCode, setLobbyCode] = useState('');
  const [username, setUsername] = useState('');
  const [inLobby, setInLobby] = useState(false);
  const [isNewLobby, setIsNewLobby] = useState(false);

  return (
    <LobbyContext.Provider
      value={{
        lobby, setLobby,
        lobbyCode, setLobbyCode,
        username, setUsername,
        inLobby, setInLobby,
        isNewLobby, setIsNewLobby
      }}
    >
      {children}
    </LobbyContext.Provider>
  );
};
