import jwt from 'jsonwebtoken';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { FRONTEND_URI } from './constants.js';

import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;


const app = express();
const server = createServer(app);


const io = new Server(server,{
    cors : {
        origin : `${FRONTEND_URI}`
    }
});

let usernameToSocket = new Map();
let socketToUsername = new Map();

let Chats = [];

io.on("connection", async (socket) => {

    let token = (socket.handshake.query.token).split(' ')[1];
    const user = socket.handshake.query.usernameTo;
    const username = await jwt.verify(token,SECRET_KEY).username;
    if(usernameToSocket.get(username)){
        const Socket = usernameToSocket[username];
        delete socketToUsername[Socket];
        usernameToSocket[username] = socket.id;
        socketToUsername[socket.id] = username;
    }
    else{
        usernameToSocket[username] = socket.id;
        socketToUsername[socket.id] = username;
        const onlyChats = Chats.filter((e,i) => {
            if((e.usernamefrom == username && e.usernameto == user) || (e.usernamefrom == user && e.usernameto == username)){
                return e;
            }
        })
        console.log(username, user);
        console.log(onlyChats);
        io.to(socket.id).emit("recieve-Chats",{ onlyChats });
    }

    io.to(socket.id).emit('getUsername',{ username });
    io.emit('getUsers',{ arr : Object.entries(usernameToSocket) });

    
    socket.on("send-message",({ Message, usernamefrom, usernameto }) => {
        let Socket = usernameToSocket[usernameto];
        Chats.push({
            usernamefrom,
            usernameto,
            Message
        });
        console.log(Chats);
        socket.to(Socket).emit("recieve-message",{ Message,usernamefrom, usernameto });
    })

    socket.on("disconnect", () => {
        const user = socketToUsername[socket.id];
        usernameToSocket[user] = '';
        io.emit('getUsers',{ username, arr : Object.entries(usernameToSocket) });
    });

})

const PORT = process.env.PORT || 7001;
server.listen(PORT,() => {
    console.log(`Server is running on ${PORT}`);
})