const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.get("/", (req, res) => {
    res.send("Group Chat Backend Running");
});

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.on("send_message", (data) => {

        io.emit("receive_message", {
            user: data.user,
            text: data.text
        });

    });

    socket.on("disconnect", () => {
        console.log("User Left");
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
