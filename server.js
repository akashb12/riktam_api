const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./routes/routes');

dotenv.config();

let app = express();
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);
app.use(express.json());
app.use('/api',routes);

mongoose.connect(process.env.MONGO_URL).then(()=> console.log("mongodb connected")).catch((err)=>console.log(err))

const server = app.listen(process.env.PORT || 5000,()=>{
    console.log(`riktam api running on port ${process.env.PORT}`)
})
const io = require("socket.io")(server, {
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
});
io.on("connection", (socket) => {
    console.log('connected to socket.io');
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    })
    socket.on('joinChat', (room) => {
        socket.join(room);
        console.log(`user joined room ${room}`);
    })

    socket.on('newMessage',(newMessage) => {
        let chat = newMessage.chat;
        if(!chat.users) return console.log('no users found');
        chat.users.forEach(user => {
            if(user._id == newMessage.sender._id) return;
            socket.in(user._id).emit('messageRecieved',newMessage);
        });
    })

    socket.on('likeMessage',(newMessage) => {
        let chat = newMessage.chat;
        if(!chat.users) return console.log('no users found');
        chat.users.forEach(user => {
            // if(user._id == newMessage.sender._id) return;
            socket.in(user).emit('likeRecieved',newMessage);
        });
    })

    socket.on('updateGroup',(groupData) => {
        if(!groupData.users) return console.log('no users found');
        groupData.users.forEach(user => {
            socket.in(user._id).emit('groupUpdated',groupData);
        });
    })
    
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
})