import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config/env";


export function initSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // adjust later for production
      methods: ["GET", "POST"],
    },
  });

  // store online users in memory
  const onlineUsers = new Map<string, string>(); 
  // userId -> socketId

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
      };

      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    console.log("User connected:", userId);

    // mark user online
    onlineUsers.set(userId, socket.id);

    io.emit("user:online", { userId });

     // JOIN conversation room
    socket.on("conversation:join", (conversationId: string) => {
        socket.join(conversationId);
        console.log(`${userId} joined room ${conversationId}`);
    });

    // LEAVE conversation room
    socket.on("conversation:leave", (conversationId: string) => {
        socket.leave(conversationId);
        console.log(`${userId} left room ${conversationId}`);
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", userId);

      onlineUsers.delete(userId);

      io.emit("user:offline", {
        userId,
        lastSeenAt: new Date(),
      });
    });
  });

  return {
    io,
    onlineUsers,
  };
}