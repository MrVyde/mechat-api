import "dotenv/config";

import express from "express";
import http from "http";
import { initSocket } from "./socket";

import app from "./app"; // your express app

const server = http.createServer(app);

// initialize socket
const { io } = initSocket(server);

// make io accessible globally (simple approach for Phase 1)
app.set("io", io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});