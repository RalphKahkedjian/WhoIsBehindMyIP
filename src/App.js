// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './views/lobby';
import Gameboard from './views/gameboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/gameboard" element={<Gameboard />} />
      </Routes>
    </BrowserRouter>
  );
}
