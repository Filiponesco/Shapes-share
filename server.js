
var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("Socket server starts...");

var socket = require('socket.io');

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
  
    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('move',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'move' " + data.x + " " + data.y + " " + data.item);
      
        // Send it to all other clients
        socket.broadcast.emit('move', data);
        
        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);