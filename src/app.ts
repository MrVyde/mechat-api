import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import conversationRoutes from "./routes/conversation.routes";
import userRoutes from "./routes/user.routes";
import { FRONTEND_URL, } from "./config/env";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/users", userRoutes);

export default app;