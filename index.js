var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/tone', function(req, res){
   res.sendFile(__dirname + '/tone.mp3');
});


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

io.on('connection', function(socket){

	socket.on('user connected', function(msg){
    socket.broadcast.emit('user connected', msg);
  });

  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    socket.broadcast.emit('user disconnected', '');
  });
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});