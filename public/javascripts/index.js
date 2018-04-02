/* eslint-disable */

var socket = io();

socket.on("connect", function() {
    console.log("connected");
    // socket.emit('createMsg', {
    //     from: 'User',
    //     text: 'I am coming',
    //     createAt: new Date().getTime()
    // })
});

socket.on("disconnect", function() {
    console.log("oops");
});

socket.on('newMsg', function(msg) {
    console.log('New Message', msg);
});
