import { LobbyProvider } from '../src/context/lobbyContext'
import Lobby from '../src/views/lobby'
import Gameboard from '../src/views/gameboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <LobbyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/gameboard" element={<Gameboard />} />
        </Routes>
      </Router>
    </LobbyProvider>
  );
}

export default App;
