const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messagesRoute');
const socket = require('socket.io')
const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Correct usage

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connected Successfully");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on Port ${process.env.PORT}`);
});


const io = socket(server,{
    cors :{
      origin:"https://chat-application-2-s38c.onrender.com",
        credentials:true,
    }
});

global.onlineUsers = new Map();

io.on("connection",(socket)=>{

    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set (userId,socket.id);
    })

    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve",data.message)
        }
    })
})

