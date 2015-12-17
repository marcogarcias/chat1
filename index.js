var express = require('express');
var app = express();

var server = require('http').Server(app);

var io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function(req, res){
  console.log('pagina recargada...');
  res.sendFile(__dirname + '/index.html');
});

var nicknames = {};

io.on('connection', function(socket){
  console.log('se ha conctado al chat...');
  socket.on('send message', function(data){
    console.log('se ha mandado un mensaje: ', data);
    io.sockets.emit('new message', {msg: data, nick: socket.nickname});
  });

  socket.on('new user', function(data, callback){
    if(data in nicknames){
      callback(false);
    }else{
      callback(true);
      socket.nickname = data;
      nicknames[socket.nickname] = 1;
      updateNickNames();
    }
  })

  socket.on('disconnect', function(data){
    if(!socket.nickname) return;
    delete nicknames[socket.nickname];
    updateNickNames();
  });

  function updateNickNames(){  
    io.sockets.emit('usernames', nicknames);
  }
});
