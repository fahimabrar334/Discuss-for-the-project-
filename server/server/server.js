const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve frontend files from "public" folder
app.use(express.static("public"));

// In-memory message storage (temporary)
let messages = [];

// When a user connects
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send previous chat history to new user
    socket.emit("loadMessages", messages);

    // Receive message from frontend
    socket.on("sendMessage", (data) => {
        const messageData = {
            user: data.user,
            text: data.text,
            time: new Date().toLocaleTimeString()
        };

        // Save message
        messages.push(messageData);

        // Broadcast to ALL users
        io.emit("newMessage", messageData);
    });

    // When user disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
