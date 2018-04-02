#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('mini-chat:server');
var http = require('http');
const socketIO = require('socket.io');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
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
    console.log('new user');
    socket.emit('newMsg', {
        from: 'Admin',
        text: 'Welcome to mini chat',
        createAt: new Date().getTime()
    });

    socket.broadcast.emit('newMsg', {
        from: 'user',
        text: 'user joined channel',
        createAt: new Date().getTime()
    });

    socket.on('createMsg', function(msg) {
        console.log('new msg:', msg);
        io.emit('newMsg', {
            from: msg.from,
            text: msg.text,
            createAt: new Date().getTime()
        });
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
