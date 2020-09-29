const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const imageRouter = require("./routers/imageRouter");
const postRouter = require("./routers/postRouter");
const cors = require("cors");
const { addUser, removeUser, getUser, getUsersInRoom } = require('./user');
const { newQuestion, getQuestion, setQuestion } = require('./post');

app.use(express.json());
app.use(cors());
app.use("/upload", imageRouter);
app.use("/posts", postRouter);

const users={};
const socketToRoom={};
const posts = [];

io.on("connection", (socket) => {
    socket.on("join", ({userName, userImg, roomID}) => {
        const {error, user} = addUser({
            id: socket.id,
            userName,
            userImg,
            roomId: roomID
        });

        if (error) {
            console.log(error);
        }

        const time = getCurrentTime(socket);
        socket.join(roomID);
        socket.emit("join", { time, id: socket.id, userName: user.userName });
        socket.emit("message", { userName: "Admin", message: "You joined !", users: getUsersInRoom(roomID) })
        socket.to(roomID).emit("message", { userName: "Admin", message: `${userName} has joined !`, users: getUsersInRoom(roomID) });
    });

    socket.on("message", ({ userName, message, roomID }) => {
        socket.to(roomID).emit("message", { userName, message, users: getUsersInRoom(roomID) });
    });
    
    socket.on("send-image", ({ userName, img, roomID }) => {
        socket.to(roomID).emit("send-image", { userName, img });
    });

    socket.on("profile-image", (user) => {
        const updateUser = getUser(user.id);
        updateUser.userImg = user.img;

        socket.to(updateUser.roomId).emit("room-data", {
            users: getUsersInRoom(updateUser.roomId)
        })
    });
    
    socket.on("post question", ({ postDetails, roomId, userId }) => {
        newQuestion(postDetails, userId);
        postDetails = {
            ...postDetails,
            answer: null
        }
        socket.to(roomId).emit("question", postDetails);
    });

    socket.on("send answer", details => {
        let post = getQuestion(details.postId);
        const result = post.answer === details.answer;

        post = {
            ...post,
            users: [
                ...post.users,
                {
                    userName: details.userName,
                    result
                }
            ]
        }

        setQuestion(post);
        socket.to(post.userId).emit("get answer", post);
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.roomId).emit('message', {userName: 'Admin', message: `${user.userName} has left !`, users: getUsersInRoom(user.roomId)});
            io.to(user.roomId).emit('room-data', {
                users: getUsersInRoom(user.roomId)
            })
        }
    });
});
// io.on('connection', socket => {
//     socket.on("join room", roomID => {
//         if (users[roomID]) {
//             const length = users[roomID].length;
//             if (length === 4) {
//                 socket.emit("room full");
//                 return;
//             }
//             users[roomID].push(socket.id);
//         } else {
//             users[roomID] = [socket.id];
//         }
//         socketToRoom[socket.id] = roomID;
//         const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

//         socket.emit("all users", usersInThisRoom);
//     });

//     socket.on("sending signal", payload => {
//         io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
//     });

//     socket.on("returning signal", payload => {
//         io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
//     });

//     socket.on('disconnect', () => {
//         const roomID = socketToRoom[socket.id];
//         let room = users[roomID];
//         if (room) {
//             room = room.filter(id => id !== socket.id);
//             users[roomID] = room;
//         }
//     });

// });

const getCurrentTime = (socket) => {
    return new Date();
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});