#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('mini-chat:server');
const http = require('http');
const socketIO = require('socket.io');
const { generateMessage } = require('../utils/message');
const msgEvents = require('../types/msgEvents');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
let io = socketIO(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});

server.on('error', onError);
server.on('listening', onListening);

/**
 * Listen on websocket:
 */

io.on('connection', (socket) => {
    console.log('new user:', socket.id);
    socket.emit(msgEvents.newMsg, generateMessage('admin', 'Welcome to mini chat'));

    socket.to().emit(msgEvents.newMsg, generateMessage('admin', 'haha'));

    socket.broadcast.emit(msgEvents.newMsg, generateMessage('admin', 'new user just joined'));

    socket.on(msgEvents.createMsg, function(msg, cb) {
        console.log('new msg:', socket.id);
        io.emit('newMsg', generateMessage(msg.from, msg.text));
        if (cb) {
            cb('This is from server');
        }
    });

    socket.on('disconnect', function() {
        console.log('client disconnected');
    });
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
