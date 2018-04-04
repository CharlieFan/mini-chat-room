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
 * Listen on Websocket:
 */

//  On server connected
let currentUsers = new Users();

io.on('connection', (socket) => {
    console.log('current socket:', socket.id);
    
    // On Client create new Msg
    socket.on(msgEvents.createMsg, function(msg, cb) {
        let user = currentUsers.getUser(socket.id);
        let msgText = msg.text.trim();
        if (user && msgText.length > 0) {
            io.to(user.channel).emit('newMsg', generateMessage(user.name, msgText));
        } else if (msgText.length <=0 ){
            cb('Cannot send empty message');
        } else {
            cb('Invalide user');
        }
    });
    
    // On Join Channel
    socket.on('join', (params, cb) => {
        let { name, channel} = params;
        console.log('joined');

        if (!channel) {
            return cb('channel name is required!');
        }

        socket.join(channel);
        currentUsers.remove(socket.id);
        currentUsers.addUser(socket.id, name, channel);
        io.to(channel).emit(msgEvents.updateUsers, currentUsers.users);
        
        socket.emit(msgEvents.newMsg, generateMessage('Sys', `Welcome to #${channel}`));
        socket.broadcast.to(channel).emit(msgEvents.newMsg, generateMessage('Sys', `${name} just joined`));
    });

    // On disconnected
    socket.on('disconnect', function() {
        let disconnected = currentUsers.remove(socket.id);
        if (disconnected) {
            io.to(disconnected.channel).emit(msgEvents.newMsg, generateMessage('Sys', `${disconnected.name} has left`));
            io.to(disconnected.channel).emit(msgEvents.updateUsers, currentUsers.users);
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
