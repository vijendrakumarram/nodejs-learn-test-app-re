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
var playerCount=0;
console.log('Yeh....server is running...');

io.on('connection', function(socket){
  var thisClientId = shortid.generate();
  players.push(thisClientId);
  console.log('Client Connected broadcasting spawn, id:', thisClientId); 
  
  socket.broadcast.emit('spawn', { id: thisClientId});
  socket.broadcast.emit('requestPosition');
    
    
    players.forEach(function(playerId){
    if(playerId == thisClientId)
            return;
       socket.emit('spawn', {id: playerId});
       console.log('sending spawn to new player for id: ',playerId); 
    });
    
  socket.on('move',function(data){
      data.id = thisClientId;
      console.log('client moved'+JSON.stringify(data));     socket.broadcast.emit('move',data);
  });
    
    socket.on('updatePosition',function(data){
    console.log('update Position', data);
        data.id = thisClientId;
        socket.broadcast.emit('updatePosition', data);
  });
    
    
  socket.on('disconnect', function(){
    console.log('client disconnect');
    players.splice(players.indexOf(thisClientId),1);
      socket.broadcast.emit('disconnected', { id: thisClientId});
  });
    
});
