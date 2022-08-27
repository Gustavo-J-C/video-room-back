const express = require('express');
const router = express.Router();
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require('socket.io');

const PORT = process.env.PORT || 80
const server =  http.createServer(app);
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "https://video-room-front.vercel.app",
        methods: ["GET", "POST"]
    }
});

let rooms = [];

io.on("connection", (socket) => {

    socket.emit("request_rooms", rooms);
    console.log(`User Connected: ${socket.id}`);

    socket.on("set_video", (data) => {
        console.log("set video: ",data)
        socket.to(data.room).emit("recieve_video", data.newLink)
    })

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(`User with ID: ${socket.id} joinend room: ${data}`);
    })

    socket.on("create_room", (data) => {
        rooms.push(data);
        socket.emit("request_rooms", rooms) 
    })

    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("recieve_message", data)
    })

    socket.on("disconnect", () => {
        console.log("User Disconnects", socket.id)
    })
}) 


server.listen(PORT, () => {
    console.log('server runing')
})