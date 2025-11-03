import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// user joining and leaving room

const rooms = new Map();

io.on("connection", (socket) => {
  let currentRoom = null;
  let currentUSer = null;

  socket.on("join", ({ roomId, userName }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      rooms.get(currentRoom).delete(currentUSer);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
    }

    currentRoom = roomId;
    currentUSer = userName;
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    rooms.get(roomId).add(userName);

    io.to(roomId).emit("userJoined", Array.from(rooms.get(currentRoom)));
  });

  socket.on("codeChange", ({ roomId, code, file }) => {
    socket.to(roomId).emit("codeUpdate", { code, file });
  });

  socket.on("leaveRoom", () => {
    if (currentRoom && currentUSer) {
      rooms.get(currentRoom).delete(currentUSer);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));

      socket.leave(currentRoom);
      currentRoom = null;
      currentUSer = null;
    }
  });

  socket.on("typing", ({ roomId, userName }) => {
    socket.to(roomId).emit("userTyping", userName);
  });

  socket.on("languageChange", ({ roomId, language }) => {
    io.to(roomId).emit("languageUpdate", language);
  });

  socket.on("disconnect", () => {
    if (currentRoom && currentUSer) {
      rooms.get(currentRoom).delete(currentUSer);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)));
    }
  });

  socket.on("fileSelect", ({ roomId, file }) => {
    socket.to(roomId).emit("fileSelect", { file });
  });

  socket.on("chatMessage", ({ roomId, user, text }) => {
    io.to(roomId).emit("chatMessage", { user, text });
  });
});

const port = process.env.PORT || 5000;

const __dirname = path.resolve();
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
