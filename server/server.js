const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// In-memory lobbies
let lobbies = {}; // { lobbyId: { players: [{id, name}], status: "waiting"} }

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);
  const ip = socket.handshake.address;
  console.log(`Player connected, IP address of: ${ip}`)
  // Create a new lobby
  socket.on("createLobby", ({ lobbyId, playerName }) => {
    if (lobbies[lobbyId]) {
      socket.emit("errorMessage", "Lobby ID already exists");
      return;
    }

    lobbies[lobbyId] = { players: [{ id: socket.id, name: playerName }], status: "waiting" };
    socket.join(lobbyId);

    io.to(lobbyId).emit("lobbyUpdate", lobbies[lobbyId]);
  });

  // Join an existing lobby
  socket.on("joinLobby", ({ lobbyId, playerName }) => {
    if (!lobbies[lobbyId]) {
      socket.emit("errorMessage", "Lobby does not exist");
      return;
    }

    lobbies[lobbyId].players.push({ id: socket.id, name: playerName });
    socket.join(lobbyId);

    io.to(lobbyId).emit("lobbyUpdate", lobbies[lobbyId]);
    if(playerName.length == 6) {
      lobbies[lobbies].status == "in game"
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);

    for (let lobbyId in lobbies) {
      const lobby = lobbies[lobbyId];
      lobby.players = lobby.players.filter(p => p.id !== socket.id);

      if (lobby.players.length === 0) {
        delete lobbies[lobbyId];
      } else {
        io.to(lobbyId).emit("lobbyUpdate", lobby);
      }
    }
  });
});

server.listen(3001, () => console.log("Server running on port 3001"));
