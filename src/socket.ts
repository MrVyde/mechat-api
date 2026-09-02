import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { JWT_SECRET, FRONTEND_URL, } from "./config/env";


export function initSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  // store online users in memory
    const onlineUsers = new Map<
    string,
    Set<string>
  >();
  // userId -> active socket IDs


  io.use((socket, next) => {
    try {
      const cookieHeader =
        socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(
          new Error("Unauthorized")
        );
      }

      const cookies = Object.fromEntries(
        cookieHeader
          .split(";")
          .map((cookie) => {
            const [key, ...value] =
              cookie.trim().split("=");

            return [
              key,
              decodeURIComponent(
                value.join("=")
              ),
            ];
          })
      );

      const token =
        cookies.accessToken;

      if (!token) {
        return next(
          new Error("Unauthorized")
        );
      }

      const decoded = jwt.verify(
        token,
        JWT_SECRET
      ) as {
        userId: string;
      };

      socket.data.userId =
        decoded.userId;

      next();
    } catch {
      next(
        new Error("Unauthorized")
      );
    }
  });


  io.on("connection", async (socket) => {
  const userId = socket.data.userId;

// Personal room for user-specific events
  await socket.join(userId);

  const userSockets =
    onlineUsers.get(userId) ?? new Set();

  const wasOffline = userSockets.size === 0;

  userSockets.add(socket.id);

  // mark user online
  onlineUsers.set(userId, userSockets);

  socket.emit("presence:sync", {
    onlineUserIds: [...onlineUsers.keys()],
  });

  if (wasOffline) {
    socket.broadcast.emit("user:online", {
      userId,
    });
  }

  // JOIN conversation room
  socket.on(
    "conversation:join",
    (conversationId: string) => {
      socket.join(conversationId);
    }
  );

  // LEAVE conversation room
  socket.on(
    "conversation:leave",
    (conversationId: string) => {
      socket.leave(conversationId);
    }
  );

  socket.on("disconnect", () => {
    const sockets = onlineUsers.get(userId);

    if (!sockets) {
      return;
    }

    sockets.delete(socket.id);

    if (sockets.size > 0) {
      return;
    }

    onlineUsers.delete(userId);

    io.emit("user:offline", {
      userId,
      lastSeenAt: new Date().toISOString(),
    });
  });
});

  return {
    io,
    onlineUsers,
  };
}