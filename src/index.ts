import app from './api';
import {createServer} from 'http';
import {Server, Socket} from 'socket.io';
import {config} from 'dotenv';
import {instrument} from '@socket.io/admin-ui';
import SocketManager from './utils/socket';

config();

const PORT = parseInt(process.env.PORT || '8000');

const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: '/ws',
});

instrument(io, {
  auth: false,
  mode: 'development',
});

io.on('connection', (socket: Socket) => {
  console.log(`[CONNECTION] Client ID: ${socket.id}`);

  const socketManager = new SocketManager(socket);

  socket.on('disconnect', () => {
    console.log('Disconnected from', socket.id);
    if (socketManager.wavWriter) {
      socketManager.wavWriter?.end();
      socketManager.wavWriter = null;
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`[SERVER] Started listening on port ${PORT}`);
});
