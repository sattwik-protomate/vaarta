import app from './api';
import {createServer} from 'http';
import {Server, Socket} from 'socket.io';
import {config} from 'dotenv';

config({
  path: '.env',
});

type ClientInfo = {
  name: string;
};

type ClientMessage = {
  timestamp: number;
  msg: string;
};

const PORT = parseInt(process.env.PORT || '8000');

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket: Socket) => {
  console.log(`[CONNECTION] Client ID: ${socket.id}`);

  var name = socket.id;

  socket.addListener('info', (info: ClientInfo) => {
    console.log('[CLIENT] Received `info`:');
    console.table({
      id: socket.id,
      ...info,
    });
    name = info.name!;
  });

  socket.addListener('message', (data: ClientMessage) => {
    const timestamp = new Date(data.timestamp);
    const msg = data.msg;
    console.log(`${timestamp.toISOString()} | [${name}] ${msg}`);
    io.emit('message', {
      timestamp: timestamp.toISOString(),
      name,
      msg,
    });
  });

  socket.on('disconnect', () => {
    console.log(`[CLIENT] Disconnected from ${name}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[SERVER] Started listening on port ${PORT}`);
});
