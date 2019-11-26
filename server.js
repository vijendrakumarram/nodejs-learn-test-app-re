var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(process.env.PORT || 8080, function(){
console.log('listening on: 8080');
});

console.log('Yeh....server is running...');