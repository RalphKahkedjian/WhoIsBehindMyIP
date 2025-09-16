const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// In-memory lobbies
let lobbies = {}; 
// { lobbyId: { players: [{id, name, role}], status: "waiting"} }

const FLAGS = ["red", "green", "blue", "pink", "orange"];
const REFEREE = "white";

// Helper → assign role randomly
function assignRole(lobby) {
  let assignedFlags = lobby.players.map(p => p.role);
  let availableFlags = FLAGS.filter(f => !assignedFlags.includes(f));

  // if referee not taken, 20% chance referee is next
  if (!assignedFlags.includes(REFEREE) && lobby.players.length === 5) {
    return REFEREE;
  }

  // pick a random flag from available
  if (availableFlags.length > 0) {
    return availableFlags[Math.floor(Math.random() * availableFlags.length)];
  }

  return null; // no roles left
}

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);
  const ip = socket.handshake.address;
  console.log(`Player connected, IP address of: ${ip}`);

  // Create a new lobby
  socket.on("createLobby", ({ lobbyId, playerName }) => {
    if (lobbies[lobbyId]) {
      socket.emit("errorMessage", "Lobby ID already exists");
      return;
    }

    const role = assignRole({ players: [] });
    lobbies[lobbyId] = { 
      players: [{ id: socket.id, name: playerName, role }], 
      status: "waiting" 
    };
    socket.join(lobbyId);

    io.to(lobbyId).emit("lobbyUpdate", lobbies[lobbyId]);
  });

  // Join an existing lobby
  socket.on("joinLobby", ({ lobbyId, playerName }) => {
    const lobby = lobbies[lobbyId];
    if (!lobby) {
      socket.emit("errorMessage", "Lobby does not exist");
      return;
    }
    if (lobby.players.length >= 6) {
      socket.emit("errorMessage", "Lobby is full");
      return;
    }

    const role = assignRole(lobby);
    if (!role) {
      socket.emit("errorMessage", "No roles available");
      return;
    }

    lobby.players.push({ id: socket.id, name: playerName, role });
    socket.join(lobbyId);

    // if lobby is full → set status to in-game
    if (lobby.players.length === 6) {
      lobby.status = "in-game";
    }

    io.to(lobbyId).emit("lobbyUpdate", lobby);
  });

  // Delete lobby manually
  socket.on("deleteLobby", ({ lobbyId }) => {
    if (lobbies[lobbyId]) {
      delete lobbies[lobbyId];
      io.emit("lobbyDeleted", lobbyId);
      console.log(`Lobby ${lobbyId} deleted`);
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
        io.emit("lobbyDeleted", lobbyId);
      } else {
        lobby.status = "waiting";
        io.to(lobbyId).emit("lobbyUpdate", lobby);
      }
    }
  });
});

server.listen(3001, () => console.log("Server running on port 3001"));
