const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static("public"));

const PORT = 5000;
const serverInstance = app.listen(PORT, ()=>{
    console.log("listening to port " + PORT);
});

const io = socketio(serverInstance);

// listening for socket connection
io.on("connection",(socket)=>{
    console.log("made socket connection");

    socket.on("beginPath", (data)=>{
        io.sockets.emit("beginPath",data);
    })
    socket.on("drawStroke",(data)=>{
        io.sockets.emit("drawStroke",data);
    })
    socket.on("undoRedoActions",(data)=>{
        io.sockets.emit("undoRedoActions",data);
    })
})