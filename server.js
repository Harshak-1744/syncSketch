const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const helmet = require('helmet');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(helmet()); 
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });
    
    socket.on('reset', () => {
        socket.broadcast.emit('reset');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
