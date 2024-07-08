const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });

    socket.on('clearCanvas', () => {
        io.emit('clearCanvas');
    });

    socket.on('undoLast', (data) => {
        io.emit('undoLast', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
