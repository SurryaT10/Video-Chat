const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const imageRouter = require("./routers/imageRouter");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/upload", imageRouter);

io.on("connection", (socket) => {
    socket.on("join", ({userName, roomID}) => {
        const time = getCurrentTime(socket);
        socket.join(roomID);
        socket.emit("join", time);
        socket.emit("message", { userName: "Admin", message: "You joined !" })
        socket.to(roomID).emit("message", { userName: "Admin", message: `${userName} has joined !` });
    });

    socket.on("message", ({ userName, message, roomID }) => {
        socket.to(roomID).emit("message", { userName, message });
    });
    
    socket.on("send-image", ({ userName, img, roomID }) => {
        socket.to(roomID).emit("send-image", { userName, img });
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("message", { userName: "Admin", message: "A user has left !"  });
    });
});

const getCurrentTime = (socket) => {
    return new Date();
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});