/* eslint-disable */

var socket = io();
console.log(socket)


socket.on("connect", function() {
    console.log("connected");
});

socket.on("disconnect", function() {
    console.log("oops");
});

socket.on('newMsg', function(msg) {
    console.log('New Message', msg);
    var li = document.createElement('li');
    var content = document.createTextNode(msg.from + ': ' +msg.text);
    li.appendChild(content);
    document.querySelector('#message-list').appendChild(li);
});



document.querySelector('#message-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var msgValue = document.querySelector('[name=message]').value
    console.log(msgValue);
    socket.emit('createMsg', {
        from: 'Charlie',
        text: msgValue,
        createAt: new Date().getTime()
    }, function(data) {
        console.log('got it', data)
    });
});