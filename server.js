//Local Server Code
/*
var io = require('socket.io')(process.env.PORT || 3000);
console.log('server started....');
*/

//Remote Server Code
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(process.env.PORT || 8080, function(){
console.log('listening on: 8080');
});


var shortid = require('shortid');
var players = [];

console.log('Yeh....server is running...');

io.on('connection', function(socket){
  var thisPlayerId = shortid.generate();
    
    var player = {
      id: thisPlayerId,
            x:0,
            y:0  
    };
  players[thisPlayerId] = player;
  console.log('Client Connected broadcasting spawn, id:', thisPlayerId); 
  
  socket.broadcast.emit('spawn', { id: thisPlayerId});
  socket.broadcast.emit('requestPosition');
    
    
   for(var playerId in players){
    if(playerId == thisPlayerId)
       continue;
       
       socket.emit('spawn', players[playerId]);
       console.log('sending spawn to new player for id: ', playerId);
    }
    
  socket.on('move',function(data){
      data.id = thisPlayerId;
      console.log('client moved'+JSON.stringify(data));
      player.x = data.x;
      player.y = data.y;
      socket.broadcast.emit('move',data);
  });
    
    socket.on('updatePosition',function(data){
    console.log('update Position', data);
        data.id = thisPlayerId;
        socket.broadcast.emit('updatePosition', data);
  });
    
    
  socket.on('disconnect', function(){
    console.log('client disconnect');
    delete players[thisPlayerId];
      socket.broadcast.emit('disconnected', { id: thisPlayerId});
  });
    
});
