var express = require('express');
var app = express();
var path = require('path');
leveldb = require('level');
var WebSocketServer = require('websocket').server;
var http = require('http');

var level = require('level-party');
var clients = [];
var browserClient;

var db = level(__dirname + '/data', {valueEncoding: 'jason'});
/*
*   start server
*/
var server = app.listen(8082, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Comment app listening at http://%s:%s", host, port)
})
//-- serves static files
app.use('/', express.static('public'));

//Websocket server side initialized
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});


//Listen function for websocket
wsServer.on('request', function(request) {

    var connection = request.accept('', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    console.log("Origin is: " + request.origin);
    clients.push(connection);
    browserClient = connection;
    browserClient.on('message', function(message) {
        //Received message from  a client
        
        var val;
         db.get("comments", function(err,value){
            if(value){
                val = value + " ; " + message.utf8Data ;
            }else{
                val =  message.utf8Data ;
                db.put("comments", val);
            }
         });
        
        console.log(message);
        //Send the same message to all the clients
        for (let i = 0; i < clients.length; i++) {
            clients[i].sendUTF(message.utf8Data);
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

app.use('/history', function(req,res){
    db.get("comments", function(err,value){
        res.send(value);
    });
});

