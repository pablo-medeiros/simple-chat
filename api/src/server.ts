import cors from 'cors';
import express from 'express';
import http from 'http';
import io from 'socket.io';
import Auth from './controllers/ws/Auth';

const app = express();
app.use(cors());

const server = http.createServer(app);

export const socketServer = io(server,{
  transports: ['polling', 'websocket'],
})

socketServer.on('connection',Auth)

server.listen(3333,function(){
  console.log('Listen 3333')
})