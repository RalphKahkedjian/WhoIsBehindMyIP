const { makeSessionId, deterministicIPv4FromSession } = require('./utilis/IP_Generator');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let lobbies = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // Create lobby
  socket.on("createLobby", ({ lobbyId, playerName }) => {
    if (lobbies[lobbyId]) {
      socket.emit("errorMessage", "Lobby already exists");
      return;
    }

    const sessionId = makeSessionId();
    const fakeIp = deterministicIPv4FromSession(sessionId);

    const player = {
      socketId: socket.id,
      sessionId,
      displayName: playerName,
      fakeIp
    };

    lobbies[lobbyId] = {
      id: lobbyId,
      players: [player],
      status: "waiting"
    };

    socket.join(lobbyId);
    console.log("Creating player:", playerName, "with IP:", fakeIp);
    io.to(lobbyId).emit("lobbyUpdate", lobbies[lobbyId]);
  });

  // Join lobby
  socket.on("joinLobby", ({ lobbyId, playerName }) => {
    const lobby = lobbies[lobbyId];
    if (!lobby) {
      socket.emit("errorMessage", "Lobby not found");
      return;
    }
    if (lobby.players.length >= 10) {
      socket.emit("errorMessage", "Lobby is full (max 10 players)");
      return;
    }

    const sessionId = makeSessionId();
    const fakeIp = deterministicIPv4FromSession(sessionId);

    const player = {
      socketId: socket.id,
      sessionId,
      displayName: playerName,
      fakeIp
    };

    lobby.players.push(player);
    socket.join(lobbyId);

    if (lobby.players.length === 10) {
      lobby.status = "in-game";
    }

    io.to(lobbyId).emit("lobbyUpdate", lobby);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (let lobbyId in lobbies) {
      const lobby = lobbies[lobbyId];
      lobby.players = lobby.players.filter(p => p.socketId !== socket.id);

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
