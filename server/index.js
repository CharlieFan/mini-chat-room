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
const { Users } = require('../model/users');

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

//  On server connected
let currentUsers = new Users();

io.on('connection', (socket) => {
    console.log('current socket:', socket.id);
    
    // On Client create new Msg
    socket.on(msgEvents.createMsg, function(msg, cb) {
        let user = currentUsers.getUser(socket.id);
        if (user) {
            io.to(user.channel).emit('newMsg', generateMessage(msg.from, msg.text));
        }
        if (cb) {
            cb('This is from server');
        }
    });
    
    // On Join channel
    socket.on('join', (params, cb) => {
        let { name, channel} = params;
        if (!channel) {
            return cb('channel name is required!');
        }

        socket.join(channel);
        currentUsers.remove(socket.id);
        currentUsers.addUser(socket.id, name, channel);
        socket.emit(msgEvents.newMsg, generateMessage('Admin', `Welcome to ${channel}`));

        socket.broadcast.to(channel).emit(msgEvents.newMsg, generateMessage('admin', `${name} just joined`));
    });

    // On disconnected
    socket.on('disconnect', function() {
        let disconnected = currentUsers.remove(socket.id);
        if (disconnected) {
            io.to(disconnected.channel).emit(msgEvents.newMsg, generateMessage('Admin', `${disconnected.name} has left`));
            console.log(`${disconnected.name} ${socket.id} is Disconnected`);
        }
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
