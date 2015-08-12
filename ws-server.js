var http = require('http');
var server = http.createServer(function(req, res) {


});

var clients = [];
var count = 0;

server.listen(1234, function() {
  console.log((new Date()) + ' Server is listening on port 1234');
});

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', function(r) {
  // Accept the connection
  var connection = r.accept('echo-protocol', r.origin);

  // Store connected clients
  var id = count++;
  clients[id] = connection;
  console.log((new Date()) + ' Connection accepted [' + id +']');
  
  // Listen for incoming messages and broadcast messages to clients
  connection.on('message', function(message) {
    // String message that was sent to us
    var msgString = message.utf8Data;
    console.log((new Date()) + 'Received: ' + msgString);

    // Loop through all clients
    for(var i in clients) {
      // send a message to the client with the message
      clients[i].sendUTF(msgString);
    }
  });

  // Listen for a client disconnecting and remove from list of clients
  connection.on('close', function(reasonCode, description) {
    delete clients[id];
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });

});