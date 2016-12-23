var app = require('express')();
var http = require('http').Server(app);
var express = require('express');
var io = require('socket.io')(http);
// Load the full build.
var _ = require('lodash');

// Routing
app.use(express.static(__dirname + '/public'));


/*app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/tone', function(req, res){
   res.sendFile(__dirname + '/tone.mp3');
});*/


/*io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});*/

/*io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});*/

var countUsers = 0;
var users = [];

io.on('connection', function(socket){

  socket.emit('connected', users);

	socket.on('user connected', function(msg){
    var aux = {
      id: countUsers,
      username: msg.username
    };

    socket.idUser = countUsers;
    socket.username = msg.username;
    users.push(aux);
    countUsers++;
    socket.broadcast.emit('user connected', msg);
  });

  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    var index = _.findIndex(users,{id:socket.idUser});
    if(index !== -1)
    {
      _.pullAt(users, [index]);
      socket.broadcast.emit('user disconnected', {username: socket.username, index: index});
    }

  });
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});