/* eslint-disable */
var query = window.location.search;
query = query.slice(1);
queryArry = query.split('&');
var queryObj = {};
for (var i = 0; i < queryArry.length; i++) {
    var paramArry = queryArry[i].split('=');
    queryObj[paramArry[0]] = paramArry[1];
}

var channelHeader = document.querySelector('#channel-header');
channelHeader.textContent = '# ' + queryObj.channel;
// console.log(queryObj)

var socket = io();

socket.on('connect', function() {
    console.log('connected', socket.id);

    socket.emit('join', {
        name: queryObj.username,
        channel: queryObj.channel
    }, function (err) {
        if (err) throw err;
    })
});

socket.on('updateUsers', function(users) {
    console.log(users);
    var memberList = document.querySelector('#member-list')
    var lastChild
    while(lastChild = memberList.lastChild) {
        memberList.removeChild(lastChild)
    }
    for(var i = 0; i < users.length; i++) {
        var li = document.createElement('li');
        li.textContent = users[i].name
        memberList.appendChild(li);
    }
});

socket.on('disconnect', function() {
    console.log("oops");
});

socket.on('newMsg', function(msg) {
    console.log('New Message', msg);
    var li = document.createElement('li');
    var div = document.createElement('div');
    var strong = document.createElement('strong');
    var p = document.createElement('p');
    var span = document.createElement('span');
    var content = document.createTextNode(msg.text);
    var name = document.createTextNode(msg.from);
    var time = document.createTextNode(msg.createAt);
    strong.appendChild(name);
    p.appendChild(time);
    div.appendChild(strong);
    div.appendChild(p);
    span.appendChild(content);
    li.appendChild(div);
    li.appendChild(span);
    document.querySelector('#message-list').appendChild(li);
});



document.querySelector('#message-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var msgValue = document.querySelector('[name=message]').value
    socket.emit('createMsg', {
        text: msgValue
    }, function(data) {
        console.log('got it', data)
    });

    document.querySelector('[name=message]').value = "";
});