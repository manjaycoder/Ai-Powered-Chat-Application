// packages
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import generateContent from "./services/ai.service.js"
// configurations
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// middleware(s)
app.use(cors());

// socket.io stuff
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message",async (message) => {
    console.log("Message received:", message);
   
    try {
      const response=await generateContent(message)
      io.emit("message", response);
    } catch (error) {
       console.error("Error generating content:", error);
      socket.emit("error", "Failed to generate content.");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Run the server
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
